# Contributing

## Prerequisites

Complete the [Getting Started](docs/getting-started.md) guide before making any changes.

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Direct commits are not allowed. |
| `feat/<description>` | New feature or enhancement |
| `fix/<description>` | Bug fix |
| `chore/<description>` | Dependency updates, tooling, config changes |
| `docs/<description>` | Documentation-only changes |

Branch from `main`:

```bash
git checkout main && git pull
git checkout -b feat/my-feature
```

## Development Workflow

1. Make your changes in the feature branch.
2. Run lint before committing:
   ```bash
   npm run lint
   ```
3. Verify the app builds without errors:
   ```bash
   npm run build
   ```
4. Push your branch and open a pull request against `main`.

## Pull Request Guidelines

- Keep PRs focused — one logical change per PR.
- Write a clear title and describe **what** changed and **why** in the body.
- Link any related issues.
- Ensure `npm run lint` and `npm run build` both pass before requesting review.
- At least one approval is required before merging.

## Code Conventions

### TypeScript

- Prefer `interface` for object shapes; use `type` for unions and aliases.
- Avoid `any`. Use `unknown` when the type is genuinely unknown and narrow it explicitly.
- Export types from `src/types/` — do not co-locate type definitions with components unless they are truly component-specific.

### Components

- One component per file. File name matches the exported component name in kebab-case (`workspace-editor.tsx` → `export function WorkspaceEditor`).
- Keep components focused — extract logic into custom hooks when a component grows complex.
- Use `shadcn/ui` primitives from `src/components/ui/` rather than raw HTML elements for interactive controls.

### Feature Modules

- New features go in `src/features/<feature-name>/`.
- API calls belong in `src/features/<feature-name>/api/`, not inside components.
- Use TanStack Query (`useQuery`, `useMutation`) for all data fetching — do not call `apiClient` directly inside components.

### State

- UI-only state (modals, toasts, preferences) → Zustand `useUIStore`.
- Server/async state → TanStack Query.
- Local ephemeral state (controlled inputs, toggles) → `useState`.

### Styling

- Use Tailwind utility classes. Avoid inline styles.
- Use `cn()` (from `src/lib/utils.ts`) to merge conditional class names.
- Follow the existing design token conventions from `shadcn/ui` (e.g. `bg-primary`, `text-muted-foreground`).

### Internationalization

- All user-visible strings must use the `t()` function from `react-i18next`.
- Add keys to **both** `src/locales/en/` and `src/locales/bo/` translation files.
- Choose the appropriate namespace: `common`, `auth`, `admin`, `dashboard`, or `workspace`.

### Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `workspace-editor.tsx` |
| React components | PascalCase | `WorkspaceEditor` |
| Hooks | camelCase with `use` prefix | `useEditorDraft` |
| Types / Interfaces | PascalCase | `AssignedTask` |
| Constants | UPPER_SNAKE_CASE | `MAX_ZOOM_LEVEL` |
| Zustand actions | camelCase | `setEditorFontSize` |

## Adding a New Page

1. Create the page component in `src/pages/<section>/`.
2. Add a lazy import and route entry in `src/routes/app-routes.tsx`.
3. If the page is role-restricted, wrap it with `<ProtectedRoute allowedRoles={[...]} />`.
4. Add translations for any new strings in all relevant locale files.

## Adding a New Feature Module

1. Create `src/features/<name>/` with subdirectories `api/`, `components/`, and `hooks/` as needed.
2. Export public API from an `index.ts` barrel file.
3. Register the feature's pages in the router.
4. Add Zod schemas in `src/schema/` if the feature introduces forms.
