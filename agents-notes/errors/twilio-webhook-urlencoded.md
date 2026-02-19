# Twilio Webhooks Send urlencoded, Not JSON

**Category:** errors
**Date:** 2026-02-18
**Tags:** twilio, webhook, express, urlencoded, whatsapp

## Summary

Twilio's standard webhooks (inbound messages, status callbacks) send `application/x-www-form-urlencoded` data with PascalCase fields (`From`, `To`, `Body`, `MessageSid`, `MessageStatus`). If the Express handler only uses `express.json()`, `req.body` will be `{}`.

## Details

The webhook handler at `/twilio-event` only had `express.json()` middleware. Twilio's standard webhooks were arriving as urlencoded, resulting in empty bodies. Fix: add `express.urlencoded({ extended: false })` alongside `express.json()` and parse both formats.

```typescript
server.use(path, express.json());
server.use(path, express.urlencoded({ extended: false }));
```

Then try parsing urlencoded schemas first (status callback, inbound), then JSON Event Streams format.

## Related

- `bases/twilio/providers/twilio-event-webhook-handler.provider.ts`
- `bases/twilio/schemas/twilio-webhook-body.schema.ts`
