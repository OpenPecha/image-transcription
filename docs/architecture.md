# Architecture

## Folder Structure

The project follows a **feature-first** layout. Each feature owns its API calls, components, and hooks. Shared infrastructure lives outside `features/`.

```
src/
├── App.tsx                   # Root — providers, QueryClient, router
├── main.tsx                  # Entry point
│
├── components/               # Shared, feature-agnostic UI
│   ├── ui/                   # shadcn/ui primitives (Button, Input, Card …)
│   ├── common/               # App-wide utilities (ErrorBoundary, Spinner, ThemeToggle …)
│   └── layout/               # Page chrome (MainLayout, AuthLayout, Sidebar)
│
├── features/                 # One folder per domain
│   ├── auth/                 # Auth0 provider, context, useAuth hook
│   ├── dashboard/            # Task card list for annotators/reviewers
│   ├── workspace/            # Classification workspace (image + label grid)
│   └── admin/                # User, group, and batch management (admin only)
│       ├── api/
│       │   ├── batch/        # TanStack Query hooks for batch endpoints
│       │   ├── group/        # TanStack Query hooks for group endpoints
│       │   └── user/         # TanStack Query hooks for user endpoints
│       └── components/
│           ├── batch/        # Batch list, upload dialog, task view, progress bar
│           ├── group/        # Group list, CRUD dialogs
│           └── user/         # User list, CRUD dialogs, contribution report
│
├── hooks/                    # Shared custom hooks (useDebounce, useLanguageSync)
├── lib/                      # Config & utilities
│   ├── axios.ts              # Axios instance + response interceptor
│   ├── auth.ts               # Token getter bridge for API calls
│   ├── i18n.ts               # i18next initialization
│   ├── constant.ts           # APPLICATION_NAME = 'scriptclassification'
│   ├── date-utils.ts         # Date formatting helpers
│   └── utils.ts              # cn(), preloadImage()
│
├── pages/                    # Thin route-entry components; delegate to features
│   ├── auth/
│   ├── admin/
│   ├── dashboard/
│   └── workspace/
│
├── routes/                   # React Router config and ProtectedRoute guard
├── schema/                   # Zod schemas for form validation
├── store/                    # Zustand stores
│   └── use-ui-store.ts       # Theme, language, sidebar, toasts, modal
├── types/                    # Shared TypeScript interfaces and enums
└── locales/                  # i18n translation files
    ├── en/                   # English: admin, auth, common, dashboard, workspace
    └── bo/                   # Tibetan (same keys)
```

## Feature Module Pattern

Each feature exposes a public barrel export from `index.ts` so imports across the app stay clean:

```ts
// src/features/workspace/index.ts
export { ClassificationWorkspace } from './components/script-classification'
export { useGetClassificationTask, useSubmitClassification } from './api/classification'
```

Consumers import from the feature root, never from deep paths:

```ts
import { ClassificationWorkspace } from '@/features/workspace'
```

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React component | `kebab-case.tsx` | `batch-item.tsx` |
| Custom hook | `use-kebab-case.ts` | `use-script-styles.ts` |
| Type file | `kebab-case.ts` | `batch.ts` |
| Utility | `kebab-case.ts` | `date-utils.ts` |
| Zod schema | `kebab-case-schema.ts` | `batch-schema.ts` |
| Query keys | `kebab-case-keys.ts` | `batch-keys.ts` |

## Path Alias

`@` resolves to `src/`. Configured in both `vite.config.ts` and `tsconfig.app.json`.

```ts
import { apiClient } from '@/lib/axios'
```

## State Management

The app uses two complementary state layers:

### Server State — TanStack Query

All data that lives on the backend is managed by TanStack Query. Each resource group has a `*-keys.ts` file that centralises cache key factories:

```ts
// src/features/admin/api/batch/batch-keys.ts
export const batchKeys = {
  all: ['batches'] as const,
  lists: () => [...batchKeys.all, 'list'] as const,
  report: (id: string) => [...batchKeys.all, 'report', id] as const,
  tasks: (id: string, state?: string) => [...batchKeys.all, 'tasks', id, state] as const,
}
```

Default query options set in `App.tsx`:
- `staleTime`: 5 minutes
- `retry`: 1
- `refetchOnWindowFocus`: false

Script types are prefetched at app startup with `staleTime: Infinity` (they never change at runtime).

### Client State — Zustand

`useUIStore` (`src/store/use-ui-store.ts`) holds UI-only state that persists to `localStorage` via the `persist` middleware:

| Key | Type | Persisted |
|---|---|---|
| `theme` | `'system' \| 'light' \| 'dark'` | yes |
| `language` | `'en' \| 'bo'` | yes |
| `sidebarCollapsed` | `boolean` | yes |
| `editorFontFamily` | `EditorFontFamily` | yes |
| `editorFontSize` | `EditorFontSize` | yes |
| `toasts` | `Toast[]` | no |
| `activeModal` | `string \| null` | no |
| `unsavedChanges` | `boolean` | no |

## Routing

All routes are defined in `src/routes/app-routes.tsx`. Pages are **lazy-loaded** via `React.lazy` + `Suspense`.

`ProtectedRoute` guards routes in two ways:
1. Redirects unauthenticated users to `/login`.
2. When `allowedRoles` is provided, users without a matching role are redirected to `/dashboard`.

```
/login                   → public
/callback                → public (Auth0 redirect target)
/pending-approval        → public
/dashboard               → authenticated (any role)
/workspace               → annotator | reviewer | final_reviewer
/admin/users             → admin
/admin/groups            → admin
/admin/batches           → admin
/admin/batch/:batchId    → admin
```

## Dev Server Proxy

`vite.config.ts` proxies `/s3-proxy/*` to `https://s3.us-east-1.amazonaws.com` to avoid CORS issues when loading task images during local development.
