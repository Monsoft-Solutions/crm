# PostgreSQL FK Columns Need Explicit Indexes

**Category:** patterns
**Date:** 2026-02-19
**Tags:** postgresql, drizzle, indexes, foreign-keys, performance

## Summary

PostgreSQL does NOT auto-create indexes on foreign key columns — only on PRIMARY KEY and UNIQUE constraints. Always add explicit indexes on FK columns used in WHERE/ORDER BY clauses.

## Details

For the `contact_message` table, three indexes were needed based on query patterns:

```typescript
(t) => [
    index('contact_message_contact_created_idx').on(t.contactId, t.createdAt),
    index('contact_message_external_id_idx').on(t.externalId),
    index('contact_message_contact_direction_status_idx').on(t.contactId, t.direction, t.status),
]
```

Design indexes by analyzing actual query patterns in providers/listeners, not guessing.

## Related

- `mods/contact-message/db/contact-message.table.ts`
- `drizzle/postgresql/0069_fair_leech.sql`
