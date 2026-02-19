# WhatsApp Uses Twilio Only

**Category:** patterns
**Date:** 2026-02-18
**Tags:** whatsapp, twilio, routing, meta

## Summary

WhatsApp integration uses Twilio as the sole provider. Meta Cloud API integration was removed. All outbound messages route through `sendBrandWhatsapp` → Twilio SDK.

## Details

- `sendBrandWhatsapp` finds brand's default WhatsApp number, gets org Twilio client, sends via Twilio SDK
- No routing logic needed — every number goes through Twilio
- `brand_whatsapp_number` still has `meta_phone_number_id` column in DB but it's unused
- Webhook endpoint `/twilio-event` handles both standard webhooks and Event Streams
- Docs in `docs/whatsapp/` reflect Twilio-only architecture

## Related

- `mods/brand/providers/send-brand-whatsapp.provider.ts`
- `bases/twilio/providers/twilio-event-webhook-handler.provider.ts`
- `docs/whatsapp/overview.md`
