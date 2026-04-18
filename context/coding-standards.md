# Engineering Standards

## TypeScript

- Strict mode enabled
- No `any` types — use proper typing or `unknown`
- Define interfaces/types for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only
- Use hooks for state and side effects
- Keep components focused — one responsibility per component
- Extract reusable logic into custom hooks

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Prefer Server Actions for internal app mutations and simple form submissions

Use API routes when you need:

- Webhooks
- Third-party integrations
- File uploads
- Long-running operations
- Specific HTTP status codes/headers
- External consumers (future mobile/CLI clients)

Otherwise:

- Fetch data directly in server components

## Authentication

- Use NextAuth v5 (Auth.js)
- Use `auth()` in server contexts when possible
- Protect routes at layout/server boundary
- Never expose provider tokens to client components
- Never put auth checks scattered across components

## Tailwind CSS v4

**CRITICAL:** Tailwind CSS v4 uses CSS-based configuration.

- DO NOT create `tailwind.config.ts`
- DO NOT create `tailwind.config.js`
- Configure theme only in `src/app/globals.css`
- Use `@theme` directive only
- Use CSS custom properties for tokens
- No JavaScript-based Tailwind config allowed

Example:

```css id="m98t3a"
@import 'tailwindcss';

@theme {
  --color-primary: #bd4f52;
}
```

## File Organization

- Components
  `components/[feature]/ComponentName.tsx`

- Pages
  `app/[route]/page.tsx`

- Server Actions
  `actions/[feature].ts`

- Types
  `types/[feature].ts`

- Utilities
  `lib/[utility].ts`

- Mongoose Models
  `lib/db/models/[Model].ts`

- Validators
  `lib/validators/[feature].ts`

- Static Roadmap Data
  `data/roadmap.ts`

- Auth Config
  `auth.ts`

- DB Connection
  `lib/db/connect.ts`

## Naming

- Components: PascalCase
- Component files: PascalCase
- Non-component files: kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase

## Styling

- Tailwind CSS for all styling
- Use shadcn/ui where applicable
- No inline styles
- Dark mode first

## Database

- Use MongoDB Atlas + Mongoose
- Define schemas in `src/lib/db/models`
- Use Mongoose models as source of truth
- Use indexes for userId, weekId, and common queries
- Use timestamps where relevant
- Never put database logic inside React components

## Mongoose

- Always call `await dbConnect()` before any DB operation

- `dbConnect()` lives in `src/lib/db/connect.ts`

- Never assume connection is already open

- Reuse model instances to prevent `OverwriteModelError`

Pattern:

```ts id="t42m8p"
export default mongoose.models.User || mongoose.model('User', UserSchema);
```

## Data Fetching

- Server components fetch data
- Client components use Server Actions

Validate with Zod:

- Form inputs

- Server Action inputs

- API route payloads

- Environment variables

- Zod schemas live in:

`src/lib/validators/[feature].ts`

## Local Cache

- localStorage is write-ahead cache only
- Server is always source of truth
- Cache is overwritten by server response
- Never treat cached data as authoritative

## Error Handling

- Use try/catch in Server Actions

Return:

```ts id="s61v4k"
{
  (success, data, error);
}
```

- Show user-friendly errors via toast

## Security

- Never commit secrets
- Never trust client input
- Validate and sanitize all user input
- Use environment variables for secrets
- Never expose Mongo connection strings in client code

## Code Quality

- No commented-out code unless explicitly requested
- No unused imports or variables
- Prefer small focused functions
- Extract complex logic over ~50 lines
