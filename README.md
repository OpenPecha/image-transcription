# Script Classification

A web application for crowdsourced classification of Tibetan script images. Annotators label each image with one of 31 script styles; reviewers validate those labels through a two-tier quality pipeline. Admins manage users, groups, and batches from a dedicated panel.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Auth | Auth0 (`@auth0/auth0-react`) |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| i18n | i18next + react-i18next (English / Tibetan) |
| Image rendering | UTIF2 (TIFF) + react-zoom-pan-pinch |

## Quick Start

**Prerequisites:** Node.js 18+

```bash
npm install
cp .env.example .env        # fill in the values (see docs/auth.md)
npm run dev                 # http://localhost:3000
```

To skip Auth0 during local development append `?dev=true` to the URL on first load — this activates the built-in dev auth mock.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Serve the production build on port 10000 |
| `npm run lint` | Run ESLint |

## Environment Variables

Copy `.env.example` and fill in the values:

```
VITE_BASE_URL=            # Backend API base URL (trailing slash not required)
VITE_AUTH0_DOMAIN=        # Auth0 tenant domain, e.g. your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=     # Auth0 SPA client ID
VITE_AUTH0_AUDIENCE=      # Auth0 API audience identifier
VITE_AUTH0_REDIRECT_URI=  # OAuth callback URL (defaults to <origin>/callback)
VITE_DEV_AUTH=            # Set to "true" to always use the dev auth mock
```

## Deployment

The app is deployed on **Render** as a static site. Production builds are created with `npm run build`; the output is the `dist/` directory.

## Documentation

| Doc | Description |
|---|---|
| [Architecture](docs/architecture.md) | Folder structure, naming conventions, state management patterns |
| [Auth](docs/auth.md) | Auth0 setup, role system, protected routes, dev auth mode |
| [Features](docs/features.md) | Dashboard, Workspace, and Admin feature walkthroughs |
| [API](docs/api.md) | All backend endpoints called by the frontend |
| [Contributing](docs/contributing.md) | Coding conventions, component patterns, PR workflow |
