# WhatsApp Setup

## Environment Variables

All WhatsApp config is stored in the database, seeded from environment variables at startup.

### Core Config (global, required)

| Variable | Config Key | Purpose |
|----------|------------|---------|
| `MSS_TWILIO_SID` | `twilioSid` | Twilio account SID |
| `MSS_TWILIO_TOKEN` | `twilioToken` | Twilio auth token |
| `MSS_TWILIO_FROM` | `twilioFrom` | Default Twilio phone number |

Core values are stored in the `core_conf` table (single row). See [data-model.md](./data-model.md).

### Custom Config (per-organization, optional)

| Config Key | Purpose |
|------------|---------|
| `twilioSid` | Org-specific Twilio SID |
| `twilioToken` | Org-specific Twilio token |

Custom values are stored in the `custom_conf` table (one row per organization). The outbound sender checks custom config first, falling back to core config.

**Config resolution files:**
- `bases/twilio/conf/core/twilio.core.ts`
- `bases/twilio/conf/custom/twilio.custom.ts`

## Twilio WhatsApp Setup

1. **Set env vars:** `MSS_TWILIO_SID`, `MSS_TWILIO_TOKEN`
2. **Purchase a phone number** via Twilio Console or the app's number management
3. **Register as WhatsApp sender** via Twilio Console > Messaging > WhatsApp senders, or use the Settings UI (calls `registerWhatsappSender` mutation)
4. **Configure the webhook** at `/twilio-event`:
   - For Twilio Event Streams: create a sink pointing to `https://<your-domain>/twilio-event`
   - For standard webhooks: set the messaging webhook URL to `https://<your-domain>/twilio-event`
5. **Assign the number** to a brand in Settings and set it as default

The webhook handler accepts both standard Twilio webhooks (urlencoded) and Event Streams (JSON). See [inbound.md](./inbound.md) for details.

**Webhook handler:** `bases/twilio/providers/twilio-event-webhook-handler.provider.ts`
- Path: `/twilio-event`
- Handles: inbound messages, status callbacks (`sent`, `delivered`, `read`)

## External References

- [Twilio WhatsApp API docs](https://www.twilio.com/docs/whatsapp)
- [Twilio Event Streams docs](https://www.twilio.com/docs/events)
