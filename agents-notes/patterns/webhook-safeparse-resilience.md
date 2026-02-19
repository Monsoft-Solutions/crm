# Use safeParse for Webhook Handlers

**Category:** patterns
**Date:** 2026-02-18
**Tags:** zod, webhook, safeParse, error-handling, twilio

## Summary

Always use `safeParse` (not `parse`) in webhook handlers. External services send unexpected event types and formats — crashing on unknown payloads causes retries and log noise.

## Details

Twilio Event Streams can send single objects or arrays, and event types beyond what we handle. Two patterns applied:

1. **Schema flexibility:** Accept both formats with `z.union` + `.transform`:
   ```typescript
   z.union([z.array(schema), schema])
     .transform((val) => (Array.isArray(val) ? val : [val]));
   ```

2. **Graceful rejection:** Log unknown payloads and return 200:
   ```typescript
   const result = schema.safeParse(req.body);
   if (!result.success) {
     logger.warn('Unknown payload', { body: JSON.stringify(req.body) });
     res.send(); // 200 so provider stops retrying
     return;
   }
   ```

## Related

- `bases/twilio/schemas/twilio-event-webhook-body.schema.ts`
- `bases/twilio/providers/twilio-event-webhook-handler.provider.ts`
