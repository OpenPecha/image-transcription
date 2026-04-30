# Authentication & Authorization

## Overview

Authentication is handled by **Auth0**. After login the app exchanges the Auth0 identity for a backend user record (role, group assignment) and stores the JWT for API calls.

The provider tree in `App.tsx` is:

```
ThemeProvider
  └── AuthProvider          ← wraps Auth0Provider
        └── QueryClientProvider
              └── RouterProvider
```

## Auth0 Configuration

Set these environment variables (see root README for the full variable list):

```
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=<SPA client ID>
VITE_AUTH0_AUDIENCE=<API audience>
VITE_AUTH0_REDIRECT_URI=https://your-app.onrender.com/callback
```

Auth0 is configured with:
- `useRefreshTokens: true` — silent token renewal via refresh tokens
- `cacheLocation: "localstorage"` — tokens survive page reloads
- `scope: "openid profile email"`

## Login Flow

1. User clicks "Sign in" → `loginWithRedirect` sends them to Auth0.
2. Auth0 redirects back to `/callback`.
3. `AuthProvider` receives the Auth0 user, calls `GET /user/by-identifier/{email}` to fetch the backend user record (role, group).
4. The JWT is stored in `localStorage` under `auth_token` and registered via `setAuthTokenGetter` so all subsequent Axios requests can attach `Authorization: Bearer <token>`.
5. If the backend user doesn't exist yet (first login), the context stores a minimal user object with just the email — the admin must approve and assign a role.

Pending/unapproved users are redirected to `/pending-approval`.

## Token Attachment

`src/lib/auth.ts` is a thin singleton bridge:

```ts
// Called once from AuthProvider when the user authenticates
setAuthTokenGetter(getAccessTokenSilently)

// Used anywhere a bearer token is needed
const headers = await getAuthHeaders()   // { "Content-Type": "application/json", "Authorization": "Bearer ..." }
```

The Axios instance in `src/lib/axios.ts` does **not** attach tokens via an interceptor by default — token attachment is opt-in per request. The response interceptor handles `401` globally.

## User Roles

Roles are defined in `src/types/user.ts`:

| Role | Value | Access |
|---|---|---|
| `Admin` | `"admin"` | Admin panel, all routes |
| `Annotator` | `"annotator"` | Dashboard, Workspace |
| `Reviewer` | `"reviewer"` | Dashboard, Workspace |
| `FinalReviewer` | `"final reviewer"` | Dashboard, Workspace |

Role checks happen in `ProtectedRoute` via the `allowedRoles` prop. The current user's role comes from `useAuth().currentUser.role`.

```tsx
<ProtectedRoute allowedRoles={[UserRole.Admin]}>
  <AdminUsersPage />
</ProtectedRoute>
```

## Dev Auth Mode

When Auth0 credentials are not configured, or when explicitly enabled, the app falls back to a **dev auth mock** — no real OAuth flow, no network calls.

### Activating dev auth

Any of the following enables it:

| Method | How |
|---|---|
| URL param (one-time) | Add `?dev=true` to any URL — persisted in `localStorage` |
| Environment variable | Set `VITE_DEV_AUTH=true` in `.env` |
| Missing config | If `VITE_AUTH0_DOMAIN` or `VITE_AUTH0_CLIENT_ID` is empty, dev auth activates automatically |

### Dev user

The mock logs in as a hardcoded annotator:

```json
{
  "id": "u2",
  "username": "Pema Lhamo",
  "email": "pema@example.com",
  "role": "annotator",
  "group_id": "g1"
}
```

To test other roles, edit `DevAuthProvider` in `src/features/auth/AuthProvider.tsx` or set `dev_user` in `localStorage` directly with the desired role.

### Clearing dev mode

```js
localStorage.removeItem('dev_auth_mode')
```

## `useAuth` Hook

Import from the `auth` feature barrel:

```ts
import { useAuth } from '@/features/auth'

const { currentUser, isAuthenticated, isLoading, login, logout, getToken } = useAuth()
```

| Property | Type | Description |
|---|---|---|
| `currentUser` | `User \| null` | Backend user record |
| `isAuthenticated` | `boolean` | Auth0 session is active AND backend user loaded |
| `isLoading` | `boolean` | True while Auth0 or backend user fetch is in flight |
| `login()` | `() => void` | Trigger Auth0 redirect |
| `logout()` | `() => void` | Clear tokens and redirect to `/login` |
| `getToken()` | `() => Promise<string \| null>` | Get current JWT |
| `error` | `string \| null` | Auth0 error message if any |
