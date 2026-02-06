# Result Type Error Handling

**Category:** patterns
**Date:** 2026-02-06
**Tags:** error-handling, result-type, providers, catchError

## Summary

All providers and endpoints use a `Success()`/`Error()` Result pattern with `catchError` for async operations. Never throw exceptions — always return typed results.

## Details

```typescript
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

// Wrap async calls with catchError
const { data, error } = await catchError(db.query.someTable.findFirst(...));
if (error) return Error('DESCRIPTIVE_CODE');
return Success(data);
```

- Providers are typed with `satisfies Function<Input, Output>` from `@errors/types`
- Error codes should be descriptive strings (e.g., `'CONTACT_NOT_FOUND'`)
- `catchError` wraps promises and returns `{ data, error }` — never use try/catch directly

## Related

- `monsoft-crm-app/bases/errors/utils/catch-error.util.ts`
- `monsoft-crm-app/bases/errors/types/`
- `monsoft-crm-app/bases/errors/utils/index.ts` (exports Error, Success)
