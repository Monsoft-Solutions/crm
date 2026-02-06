# API Query vs Mutation for Imperative Calls

## Summary

When a React component needs to call a tRPC endpoint imperatively (e.g., from a button click handler), use `.mutation()` not `.query()`. The `api` proxy routes queries through `trpcReact` (React hooks only - `.useQuery()`), and mutations through `vanillaApi` (supports `.mutate()`).

## Details

- `api.settings.someEndpoint.useQuery()` - works (React hook)
- `api.settings.someEndpoint.query()` - does NOT exist on the type
- `api.settings.someEndpoint.mutate()` - works (imperative call)

## Example

A "search available numbers" endpoint that gets called on button click should be defined as `.mutation()` on the server, even though it's semantically a read operation.

## Files

- `bases/api/providers/web/api.provider.ts` - the proxy routing logic
- `bases/api/providers/web/vanilla-api.provider.ts` - imperative client
