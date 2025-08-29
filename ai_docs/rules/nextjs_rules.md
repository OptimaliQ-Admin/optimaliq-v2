# Next.js Rules — Data Fetching

## Core Principles
- Prefer **Server Components** for data; stream client UI with skeletons.
- Avoid layout shift; use suspense boundaries.
- Use **Server Actions** judiciously; long jobs → background job (Vercel Cron + webhook) with progress via Supabase realtime.
- Use **Vercel AI SDK** for streaming LLM output; never block UI waiting for long jobs without a skeleton/progress.

## Data Fetching Patterns

### ✅ Server Component (Preferred)
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchDashboardData();
  return <DashboardView data={data} />;
}
```

### ✅ With Loading State
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}
```

### ❌ Client-side data fetching without loading state
```typescript
function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData); // No loading state
  }, []);
  return data ? <DashboardView data={data} /> : null;
}
```
