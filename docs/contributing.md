# Contributing

## Prerequisites

- Node.js 18+
- npm

## Local Setup

```bash
git clone <repo-url>
cd script-classification
npm install
cp .env.example .env    # fill in values or leave blank to use dev auth
npm run dev
```

With no Auth0 credentials, the app automatically uses dev auth mode. See [auth.md](auth.md#dev-auth-mode) for details.

## Branch & PR Workflow

1. Create a branch from `main`: `git checkout -b feat/<short-description>`
2. Make focused, atomic commits.
3. Open a PR against `main` when the work is ready for review.
4. CI must pass before merging.

## Commit Style

Use the conventional commit format:

```
<type>(<scope>): <short summary>
```

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change with no behaviour change |
| `style` | Formatting, whitespace |
| `chore` | Build, deps, tooling |
| `docs` | Documentation only |

Examples:
```
feat(workspace): add reviewer badge to classification panel
fix(auth): redirect pending users before loading dashboard
chore(deps): bump tanstack-query to 5.90
```

## Code Conventions

### TypeScript

- Prefer `interface` over `type` for object shapes.
- Avoid `any`. Use `unknown` and narrow with type guards.
- Export types from the feature's `index.ts` barrel, not from deep paths.
- Zod schemas live in `src/schema/`. Derive TypeScript types from them with `z.infer<>`.

### React Components

- One component per file, named with `kebab-case.tsx`.
- Props interface is defined in the same file, named `<ComponentName>Props`.
- Use `useCallback` for event handlers passed as props to avoid re-renders.
- Prefer composition over long prop lists. If a component grows past ~200 lines, split it.

```tsx
interface BatchItemProps {
  batch: Batch
  onSelect: (id: string) => void
}

export function BatchItem({ batch, onSelect }: BatchItemProps) { ... }
```

### Custom Hooks

- Prefix with `use-`, file name matches: `use-script-styles.ts`.
- A hook that wraps a TanStack Query call lives in `features/<domain>/api/` alongside the query file.
- A hook that manages local UI state lives in `features/<domain>/hooks/`.

### API Layer

Each endpoint gets its own file under `features/<domain>/api/<resource>/`. The file exports exactly one hook (query or mutation). Query key factories are in a co-located `<resource>-keys.ts` file.

```ts
// batch-keys.ts
export const batchKeys = {
  all: ['batches'] as const,
  lists: () => [...batchKeys.all, 'list'] as const,
  report: (id: string) => [...batchKeys.all, 'report', id] as const,
}
```

### Styling

- Use Tailwind utility classes exclusively. No inline `style` props.
- Use `cn()` from `src/lib/utils.ts` to merge conditional classes.
- Colours and spacing come from the Tailwind config / CSS variables — do not hardcode hex values.
- shadcn/ui components live in `src/components/ui/`. Do not modify them to add feature-specific logic; wrap them instead.

### State Management

- Server data → TanStack Query. Never put API responses in Zustand.
- Ephemeral UI state (open/closed, loading flags) → local `useState`.
- Persisted UI preferences (theme, language, font) → `useUIStore`.

### Forms

Use React Hook Form with a Zod schema resolver:

```ts
const form = useForm<BatchUploadForm>({
  resolver: zodResolver(batchUploadSchema),
})
```

Schemas live in `src/schema/`. Keep validation logic out of components.

### Error Handling

- API errors bubble up through TanStack Query's `onError` callbacks.
- Show user-facing feedback via `useUIStore().addToast(...)`.
- Wrap page-level subtrees in `ErrorBoundary` (from `src/components/common`) for unexpected errors.

### Internationalisation

- Every user-visible string must come from i18next: `const { t } = useTranslation('<namespace>')`.
- Translation keys go in both `src/locales/en/` and `src/locales/bo/`.
- Namespaces: `common`, `auth`, `dashboard`, `workspace`, `admin`.

## Linting

```bash
npm run lint
```

The project uses ESLint with the `react-hooks` and `react-refresh` plugins. Fix all lint errors before pushing. There is no auto-formatter configured — maintain consistency with the surrounding code.

## Adding a New Feature

1. Create `src/features/<name>/` with subfolders: `api/`, `components/`, `hooks/`, `index.ts`.
2. Add translation keys to all locale files.
3. Register routes in `src/routes/app-routes.tsx` with the appropriate `ProtectedRoute` wrapper.
4. Export public API from `src/features/<name>/index.ts`.
