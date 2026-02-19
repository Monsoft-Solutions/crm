# WhatsApp Integration Overview

## Provider

The app supports WhatsApp messaging through Twilio.

| Provider | API | Auth |
|----------|-----|------|
| **Twilio** | Twilio SDK | Account SID + Token |

## Outbound Routing

```
sendBrandWhatsapp({ brandId, to, body, db })
│
├─ Find brand's default WhatsApp number
│  (fallback: any assigned number)
│
└─ Send via Twilio
```

See [outbound.md](./outbound.md) for full details.

## Key Code Paths

| Area | Path | Purpose |
|------|------|---------|
| Twilio base | `bases/twilio/` | SDK sending, event webhooks, sender registration |
| Brand mod | `mods/brand/providers/send-brand-whatsapp.provider.ts` | Outbound sending |
| Contact-message mod | `mods/contact-message/hub/` | Inbound listeners, message storage |
| Settings mod | `mods/settings/api/` | Number management endpoints |

## Event-Driven Architecture

```
Webhook (HTTP POST /twilio-event)
  → Webhook handler (parse + validate)
    → emit event (e.g. twilioWhatsappMessageReceived)
      → Listener (find/create contact, store message)
        → emit app event (newContactMessage)
          → tRPC subscription (real-time UI)
```

Events are fire-and-forget (`emit()` without `await`). See [inbound.md](./inbound.md) for the full flow.

## Related Docs

- [setup.md](./setup.md) -- Environment variables and external service setup
- [inbound.md](./inbound.md) -- Receiving messages and status updates
- [outbound.md](./outbound.md) -- Sending messages through Twilio
- [data-model.md](./data-model.md) -- Database tables and relations
- [settings-api.md](./settings-api.md) -- Managing WhatsApp numbers
