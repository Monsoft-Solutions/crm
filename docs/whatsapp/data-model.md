# WhatsApp Data Model

## brand_whatsapp_number

Links WhatsApp phone numbers to brands. A brand can have multiple numbers; one is marked as default.

**File:** `mods/brand/db/brand-whatsapp-number.table.ts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `text` | PK | Unique identifier |
| `brand_id` | `text` | FK → `brand.id`, cascade delete, NOT NULL | Owning brand |
| `phone_number` | `text` | NOT NULL | E.164 phone number (e.g., `+1234567890`) |
| `twilio_sid` | `text` | nullable | Twilio sender SID (set after registration) |
| `sender_status` | `enum` | NOT NULL, default `'offline'` | `creating` / `offline` / `online` |
| `is_default` | `text` | unique with `brand_id` | `'true'` or `null` (unique constraint allows one default per brand) |

**Relations:**
- `brand` -- many-to-one with `brand`

**Provider identification:**
- `twilio_sid` set → Twilio registered sender
- `twilio_sid` null → unregistered number

---

## contact_whatsapp_message

Stores all inbound and outbound WhatsApp messages for a contact.

**File:** `mods/contact-message/db/contact-whatsapp-message.table.ts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `text` | PK | Unique identifier |
| `sid` | `text` | nullable | Twilio `MessageSid` for matching status updates |
| `contact_id` | `text` | FK → `contact.id`, cascade delete, NOT NULL | Associated contact |
| `contact_whatsapp_number` | `text` | NOT NULL | Contact's WhatsApp phone number |
| `direction` | `enum` | NOT NULL | `inbound` / `outbound` |
| `body` | `text` | NOT NULL | Message content |
| `status` | `enum` | NOT NULL, default `'queued'` | `queued` / `sent` / `delivered` / `read` |
| `created_at` | `bigint` | NOT NULL, auto-set | Unix timestamp |

**Relations:**
- `contact` -- many-to-one with `contact`

**Enums:**
- Direction: `mods/contact-message/enums/contact-message-direction.enum.ts`
- Status: `mods/contact-message/enums/contact-message-status.enum.ts`

---

## Configuration Tables

### core_conf

Global app configuration (single row). WhatsApp-relevant keys:

| Key | Purpose |
|-----|---------|
| `twilioSid` | Twilio account SID |
| `twilioToken` | Twilio auth token |
| `twilioFrom` | Default Twilio phone number |

### custom_conf

Per-organization overrides (one row per org). WhatsApp-relevant keys:

| Key | Purpose |
|-----|---------|
| `twilioSid` | Org-specific Twilio SID |
| `twilioToken` | Org-specific Twilio token |

The outbound sender checks `custom_conf` first, falling back to `core_conf`. See [outbound.md](./outbound.md).

---

## How Tables Connect

```
brand
  └─ brandWhatsappNumber (1:N)
       ├─ phoneNumber     ← matches contactWhatsappMessage.contactWhatsappNumber
       └─ twilioSid       ← links to Twilio sender registration

contact
  └─ contactWhatsappMessage (1:N)
       ├─ sid             ← matches Twilio MessageSid for status updates
       └─ contactWhatsappNumber ← contact's phone number

core_conf / custom_conf
  └─ Twilio credentials used by outbound sender
```
