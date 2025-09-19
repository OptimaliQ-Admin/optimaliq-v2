# TypeScript Rules — No `any` / Schema at Boundaries

## Core Principles
- Never use `any`. Prefer `unknown` + Zod parse at boundaries.
- All API payloads validated; surface typed results to UI.
- Strict mode enabled; no TS errors ignored.

## Examples

### ❌ Bad
```typescript
function processData(data: any) {
  return data.someProperty;
}
```

### ✅ Good  
```typescript
import { z } from 'zod';

const DataSchema = z.object({
  someProperty: z.string()
});

function processData(data: unknown) {
  const parsed = DataSchema.parse(data);
  return parsed.someProperty;
}
```

## API Boundaries
All API routes must have Zod schemas for request/response validation.
