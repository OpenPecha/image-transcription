# TextAlign

A React-based web application for collaborative image-text transcription correction with a 3-tier quality assurance (QA) pipeline. Teams use it to review and correct noisy or OCR-generated text against source images, with strict role-based workflows ensuring accuracy before final approval.

## Features

- **3-Tier QA Pipeline** — Annotator → Reviewer → Final Reviewer with full audit trail
- **Workspace Editor** — Side-by-side image viewer (pan/zoom/TIFF support) and editable text field
- **Role-Based Dashboards** — Task queues and completion metrics per role
- **Admin Panel** — Manage users, groups, and task batches
- **Internationalization** — English and Tibetan (Bodic) UI
- **Theme Support** — Light, dark, and system-default modes
- **Keyboard Shortcuts** — `Ctrl/Cmd +/-/0` to zoom, `Ctrl/Cmd+S` to save draft

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite 7 + React 18 + TypeScript 5.9 |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix UI) |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| UI state | Zustand v5 |
| Auth | Auth0 (`@auth0/auth0-react`) |
| Image handling | react-zoom-pan-pinch, utif2 (TIFF) |
| i18n | i18next + react-i18next |
| HTTP | Axios |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env   # then fill in values (see docs/getting-started.md)

# 3. Start development server at http://localhost:3000
npm run dev
```

See [docs/getting-started.md](docs/getting-started.md) for full environment variable and Auth0 setup.

## Documentation

| Document | Description |
|---|---|
| [Getting Started](docs/getting-started.md) | Local setup, env vars, Auth0 configuration |
| [Architecture](docs/architecture.md) | Folder structure, data flow, state management |
| [Workflows](docs/workflows.md) | User roles, task state machine, QA pipeline |
| [Contributing](CONTRIBUTING.md) | Branching strategy, PR process, code conventions |

## Task State Machine

```
Pending → InProgress → AwaitingReview → InReview → AwaitingFinalReview → FinalReview → Completed
                                             ↓                                  ↓
                                         Rejected ←────────────────────────────┘
                                             ↓
                                         InProgress (re-assigned)
```

Full workflow details: [docs/workflows.md](docs/workflows.md)

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + +` | Zoom in |
| `Ctrl/Cmd + -` | Zoom out |
| `Ctrl/Cmd + 0` | Reset zoom |
| `Ctrl/Cmd + S` | Save draft |

## License

MIT
