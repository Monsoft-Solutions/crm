# API Query vs Mutation for Imperative Calls

**Category:** patterns
**Date:** 2026-02-18

## Summary

Keep read-only endpoints as `.query()` on the server. Use `apiClientUtils` (tRPC query utils) to call queries imperatively from event handlers — not `.mutation()`.

## Details

- `api.settings.someEndpoint.useQuery()` — React hook (declarative)
- `apiClientUtils.settings.someEndpoint.ensureData()` — imperative fetch (returns cached data or fetches, preserves React Query cache)
- `apiClientUtils.settings.someEndpoint.invalidate()` — invalidate cache (triggers refetch for active subscribers)

Do NOT define read-only endpoints as `.mutation()` just to get an imperative `.mutate()` call. This breaks RPC semantics and bypasses React Query caching.

## Idiomatic Patterns

```typescript
// Imperative fetch in a click handler
const data = await apiClientUtils.brand.getAvailablePhoneNumbers.ensureData();

// Invalidate after a mutation succeeds
void apiClientUtils.settings.getWhatsappNumbers.invalidate();
```

## Files

- `bases/api/providers/web/api-client-utils.provider.ts` — `createTRPCQueryUtils` setup
- `bases/api/types/web/api-client-utils.type.ts` — type export
