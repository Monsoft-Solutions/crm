# Inbound WhatsApp Messages

## Flow

```
POST /twilio-event
  → parse webhook body (urlencoded or JSON)
  → emit twilioWhatsappMessageReceived
  → contact-whatsapp-message-received.listener.ts
    → find brand by toPhoneNumber
    → find or create contact by fromPhoneNumber
    → insert contactWhatsappMessage (direction: inbound)
    → emit newContactMessage
```

## Webhook Handler

**File:** `bases/twilio/providers/twilio-event-webhook-handler.provider.ts`
**Path:** `/twilio-event`

The handler accepts two webhook formats:

### Standard Twilio Webhooks (urlencoded)

Used by Twilio's standard status callbacks and messaging webhooks.

- **Inbound schema:** `twilioWebhookInboundSchema` -- fields: `MessageSid`, `From`, `To`, `Body`, `SmsStatus`
- **Status schema:** `twilioWebhookStatusSchema` -- fields: `MessageSid`, `MessageStatus`
- Strips `whatsapp:` prefix from phone numbers before emitting

### Twilio Event Streams (JSON)

Used by Twilio Event Streams for production webhook delivery.

- **Schema:** `twilioEventWebhookBodySchema` -- discriminated union of Cloud Event types
- Accepts both single event objects and arrays
- Event types: `inbound-message.received`, `message.sent`, `message.delivered`, `message.read`
- Discriminates WhatsApp vs SMS by `from` field prefix (`whatsapp:`)

Unknown event payloads are logged and acknowledged with 200 (not rejected).

## Event

`twilioWhatsappMessageReceived` (`bases/twilio/events/twilio-whatsapp-message-received.event.ts`)
```
{ fromPhoneNumber: string; toPhoneNumber: string; body: string; createdAt: number }
```

## Listener

`contact-whatsapp-message-received.listener.ts` (`mods/contact-message/hub/`)
1. Finds brand where `brandWhatsappNumber.phoneNumber === toPhoneNumber`
2. Finds existing contact by phone number scoped to brand
3. If no contact: creates contact + phone number record, emits `newContact`
4. Inserts `contactWhatsappMessage` (inbound)
5. Emits `newContactMessage`

---

## Status Updates

Status updates arrive at the same `/twilio-event` endpoint.

### Standard Webhooks

- `MessageSid` + `MessageStatus` (urlencoded)
- Event: `twilioWhatsappMessageStatusUpdated` -- `{ sid: string; status: ContactMessageStatus }`

### Event Streams

- Cloud Event types: `message.sent`, `message.delivered`, `message.read`
- Same event emitted: `twilioWhatsappMessageStatusUpdated`

### Status Values

| Status | Meaning |
|--------|---------|
| `queued` | Message accepted by Twilio |
| `sent` | Message sent to WhatsApp |
| `delivered` | Message delivered to recipient |
| `read` | Message read by recipient |

### Listener

`contact-whatsapp-message-status-updated.listener.ts` (`mods/contact-message/hub/`)
1. Updates `contactWhatsappMessage.status` where `sid` matches
2. Fetches the updated message record
3. Emits `contactMessageStatusUpdated`

## Key Files

| File | Path |
|------|------|
| Twilio event webhook | `bases/twilio/providers/twilio-event-webhook-handler.provider.ts` |
| Twilio webhooks setup | `bases/twilio/providers/twilio-webhooks-handler.provider.ts` |
| Twilio message listener | `mods/contact-message/hub/contact-whatsapp-message-received.listener.ts` |
| Twilio status listener | `mods/contact-message/hub/contact-whatsapp-message-status-updated.listener.ts` |
