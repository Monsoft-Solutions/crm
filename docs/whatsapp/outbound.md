# Outbound WhatsApp Messages

## Entry Point

```
sendWhatsappToContact({ contactId, body, db })
  → find contact with default phone number
  → get brand ID
  → sendBrandWhatsapp({ brandId, to, body, db })
  → store contactWhatsappMessage (direction: outbound, with sid)
  → return message ID
```

**File:** `mods/contact-message/providers/server/send-whatsapp-to-contact.provider.ts`

## Sending Logic

`sendBrandWhatsapp` (`mods/brand/providers/send-brand-whatsapp.provider.ts`) sends via Twilio:

```
1. Find brand's default WhatsApp number
   (fallback: any assigned number if no default)

2. Get org Twilio client

3. Send via Twilio SDK
```

## Twilio Path

**Client resolution:**
- Gets org-specific Twilio client via `getTwilioClientOrg({ organizationId })`
- Uses org's `customConf` (twilioSid/twilioToken) if available, else core config

**Sending:** (`bases/twilio/channels/whatsapp/providers/send-whatsapp.provider.ts`)
- Prefixes both `from` and `to` with `whatsapp:` (e.g., `whatsapp:+1234567890`)
- Status updates arrive via Twilio Event Streams or standard webhooks at `/twilio-event`

**Response:** `MessageSid` is stored as the message `sid`.

## Message Storage

After sending, the message is stored in `contact_whatsapp_message`:
- `direction`: `outbound`
- `status`: `queued` (default, updated later via webhooks)
- `sid`: Twilio's MessageSid (used to match status updates)

See [data-model.md](./data-model.md) for the full table schema.

## Key Files

| File | Path |
|------|------|
| Contact-level sender | `mods/contact-message/providers/server/send-whatsapp-to-contact.provider.ts` |
| Brand-level sender | `mods/brand/providers/send-brand-whatsapp.provider.ts` |
| Twilio sender | `bases/twilio/channels/whatsapp/providers/send-whatsapp.provider.ts` |
| Twilio app-level sender | `bases/twilio/channels/whatsapp/providers/send-app-whatsapp.provider.ts` |
