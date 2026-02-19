# Outbound Message fromAddress Must Match Actual Sender

**Category:** patterns
**Date:** 2026-02-19
**Tags:** messaging, email, sms, whatsapp, fromAddress

## Summary

When storing outbound messages, the `fromAddress` must come from the same source the send provider uses — never synthesize it. Guard against missing brand sender config before sending.

## Details

- **Email:** `sendBrandEmail` builds from address via `brand.domains` → `${username}@${domain}`. The send-email provider must query the same data, not fabricate `noreply@brandname.com`.
- **SMS/WhatsApp:** Query `brandPhoneNumber`/`brandWhatsappNumber` and return `Error()` if missing, rather than falling through with `?? ''`.
- **Timestamps:** If the inbound event provides a `createdAt`, use it in both the DB insert and the emitted event — don't mix provider timestamp with `Date.now()`.

## Related

- `mods/contact-message/providers/server/send-email-to-contact.provider.ts`
- `mods/contact-message/providers/server/send-sms-to-contact.provider.ts`
- `mods/brand/providers/send-brand-email.provider.ts`
