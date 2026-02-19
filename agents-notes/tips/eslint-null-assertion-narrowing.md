# ESLint Null Assertion vs Type Assertion Conflict

## Summary

`no-non-null-assertion` forbids `x!` and `non-nullable-type-assertion-style` forbids `x as T` when `!` would suffice. These seem contradictory. The solution is to narrow the type properly so neither assertion is needed.

## Pattern

Instead of:
```tsx
{condition && <Button onClick={() => handleFoo(item.field!)} />}
```

Use destructuring + guard:
```tsx
{(() => {
    const { field } = item;
    if (!field) return null;
    return <Button onClick={() => handleFoo(field)} />;
})()}
```

This lets TypeScript narrow `field` to non-null within the same scope.
