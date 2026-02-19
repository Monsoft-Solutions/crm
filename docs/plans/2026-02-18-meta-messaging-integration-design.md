# Facebook Messenger & Instagram DM Integration — Design

## Overview

Add Facebook Messenger and Instagram DM as communication channels in Monsoft CRM. This also introduces a unified message table replacing the current per-channel tables.

## Work Breakdown

### Issue 1: Unified Message Table

Consolidate `contact_sms_message`, `contact_whatsapp_message`, and `contact_email` into a single `contact_message` table.

**Schema:**

```sql
contact_message (
  id              text PK,
  external_id     text nullable,          -- Provider message ID (Twilio SID, Meta mid, Resend ID)
  contact_id      text FK → contact.id CASCADE DELETE,
  channel         enum('sms','whatsapp','email','messenger','instagram'),
  direction       enum('inbound','outbound'),

  -- Content
  body            text NOT NULL,          -- Text content (or HTML for email)
  subject         text nullable,          -- Email subject only

  -- Addressing
  from_address    text nullable,          -- Phone, email, or page-scoped ID
  to_address      text nullable,          -- Phone, email, or page-scoped ID

  -- Status
  status          enum('queued','sent','delivered','read') default 'queued',

  -- Metadata
  created_at      bigint NOT NULL
)
```

**Migration plan:**

1. Create `contact_message` table with Drizzle schema
2. Write SQL migration to copy data from the 3 existing tables, mapping columns:
   - `sid` → `external_id`
   - `contactPhoneNumber` / `contactWhatsappNumber` / `contactEmailAddress` → `from_address` (inbound) or `to_address` (outbound)
   - Add `channel` value per source table
3. Update `contact-message` module: queries, mutations, providers, listeners
4. Update `contact-channel` module: `getAvailableContactChannels` query
5. Update `contact-message` events to use the unified schema
6. Update `contact_message_summary` relations
7. Update frontend message display components
8. Drop old tables after verification
9. Extend channel enum: add `'messenger'` and `'instagram'` values

**Key changes:**

- `mods/contact-message/db/` — replace 3 table files with 1
- `mods/contact-message/hub/` — update all listeners to write to unified table
- `mods/contact-message/providers/server/` — update all send/get providers
- `mods/contact-message/api/` — update queries and mutations
- `mods/contact-message/enums/` — extend channel type enum
- `app/db/app.tables.ts` — update table exports

### Issue 2: Meta OAuth Integration

Implement Facebook Login to obtain Page Access Tokens and link Facebook Pages (with optional Instagram Business Accounts) to brands.

**New table:**

```sql
brand_meta_page (
  id                    text PK,
  brand_id              text FK → brand.id CASCADE DELETE,
  page_id               text NOT NULL,          -- Facebook Page ID
  page_name             text nullable,           -- Display name
  page_access_token     text NOT NULL,           -- Long-lived Page Access Token
  instagram_account_id  text nullable,           -- Linked Instagram Business Account ID
  instagram_username    text nullable,           -- Instagram handle for display
  is_default            text nullable,           -- 'true' or null (unique per brand)
  created_at            bigint NOT NULL
)
```

**Meta App configuration (stored in custom_conf per org):**

- `metaAppId` — Facebook App ID
- `metaAppSecret` — Facebook App Secret
- `metaVerifyToken` — Webhook verification token

**OAuth flow:**

1. User clicks "Connect Facebook" in brand settings
2. Frontend redirects to Facebook Login dialog with scopes:
   - `pages_messaging` — send/receive Messenger messages
   - `pages_manage_metadata` — subscribe to webhooks
   - `instagram_basic` — read Instagram account info
   - `instagram_manage_messages` — send/receive Instagram DMs
3. Facebook redirects back with authorization code
4. Backend exchanges code for short-lived user token
5. Backend exchanges for long-lived user token
6. Backend fetches user's Pages via `GET /me/accounts`
7. User selects which Page(s) to connect to the brand
8. Backend stores Page Access Token (already long-lived from step 6)
9. Backend fetches linked Instagram Business Account ID via `GET /{page-id}?fields=instagram_business_account`
10. Backend subscribes Page to webhooks via `POST /{page-id}/subscribed_apps`

**Module structure:**

- `bases/meta/` — repurpose: remove legacy WhatsApp code, add OAuth helpers
- `mods/brand/db/brand-meta-page.table.ts` — new table
- `mods/brand/api/` — new endpoints: connect, disconnect, list pages
- Settings UI — new "Meta Channels" section in brand settings

### Issue 3: Facebook Messenger & Instagram DM Communication

Implement inbound/outbound messaging for both channels using the Meta Graph API.

**Webhook handler (`bases/meta/`):**

The `/meta-event` endpoint already exists. Extend it to handle:

- `object: "page"` → Messenger messages
- `object: "instagram"` → Instagram DMs

**Webhook payload (Messenger):**

```json
{
  "object": "page",
  "entry": [{
    "id": "<PAGE_ID>",
    "messaging": [{
      "sender": { "id": "<PSID>" },
      "recipient": { "id": "<PAGE_ID>" },
      "message": { "mid": "<MESSAGE_ID>", "text": "Hello" }
    }]
  }]
}
```

**Webhook payload (Instagram):**

```json
{
  "object": "instagram",
  "entry": [{
    "id": "<IGID>",
    "messaging": [{
      "sender": { "id": "<IGSID>" },
      "recipient": { "id": "<IGID>" },
      "message": { "mid": "<MESSAGE_ID>", "text": "Hello" }
    }]
  }]
}
```

**Sending messages (both channels):**

```
POST https://graph.facebook.com/v22.0/{page-id}/messages
{
  "recipient": { "id": "<PSID_or_IGSID>" },
  "message": { "text": "Reply text" },
  "messaging_type": "RESPONSE"
}
Authorization: Bearer {page_access_token}
```

**Events:**

- `metaMessengerMessageReceived` — inbound Messenger message
- `metaInstagramMessageReceived` — inbound Instagram DM
- `metaMessageStatusUpdated` — delivery/read status (shared)

**Listeners:**

- `contact-messenger-message-received.listener.ts` — resolve contact by PSID, store in `contact_message`
- `contact-instagram-message-received.listener.ts` — resolve contact by IGSID, store in `contact_message`

**Contact resolution:**

For Messenger/Instagram, contacts are identified by platform-scoped user IDs (PSID/IGSID) rather than phone numbers. Need to add a way to link these IDs to contacts:

- Option: Add `meta_user_id` column to `contact` table, or
- Option: Create `contact_meta_identity` linking table (contact_id, platform, scoped_id)

The linking table approach is cleaner since one contact could have both a Messenger and Instagram identity.

**Channel availability:**

Update `getAvailableContactChannels`:
- Messenger: requires `brandMetaPages.length > 0` AND contact has a Messenger identity
- Instagram: requires brand has a meta page with `instagram_account_id` AND contact has an Instagram identity

**Outbound providers:**

- `send-messenger-to-contact.provider.ts` — get brand's default meta page, send via Graph API
- `send-instagram-to-contact.provider.ts` — get brand's meta page with instagram_account_id, send via Graph API

**Rate limits (Meta):**

- Messenger: 250 calls per hour per page
- Instagram: 200 calls per hour per Instagram account

## Dependencies

```
Issue 1 (Unified table) ← Issue 2 (Meta OAuth) ← Issue 3 (Messaging)
```

Issue 2 can start in parallel with Issue 1 (the `brand_meta_page` table and OAuth flow are independent), but Issue 3 depends on both.

## Out of Scope (future work)

- Rich media (images, files, quick replies, templates)
- Messenger/Instagram chatbot auto-replies
- Message reactions
- Typing indicators
- Thread/conversation management
- WhatsApp migration from Twilio to Meta direct
