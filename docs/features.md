# Features

## Dashboard (`/dashboard`)

Available to all authenticated roles.

The dashboard fetches the user's next assigned classification task and displays it as a task card. Each card shows the batch name, current task state, and rejection count. An empty state is shown when no tasks are pending.

**Key components**

| Component | Path | Description |
|---|---|---|
| `DashboardPage` | `src/pages/dashboard/dashboard-page.tsx` | Route entry |
| `Dashboard` | `src/features/dashboard/components/dashboard.tsx` | Task card list + welcome header |
| `TaskCard` | `src/features/dashboard/components/task-card.tsx` | Single task summary card |
| `WelcomeHeader` | `src/features/dashboard/components/welcome-header.tsx` | Greeting with role-aware subtitle |

Task state display colours are driven by `STATUS_CONFIG` in `src/types/task.ts`.

---

## Workspace (`/workspace`)

Available to **Annotator**, **Reviewer**, and **FinalReviewer** roles.

The workspace is the core annotation screen. It has no `MainLayout` wrapper — it renders its own full-screen layout.

### Layout

```
┌──────────────────────────────────────────────┐
│  WorkspaceSidebar (fixed 240 px)             │
│  - task metadata (batch, state, counts)      │
│  - Refresh, Guide, Logout buttons            │
├──────────────────────────────────────────────┤
│  ImageCanvas                                 │
│  - TIFF/standard image via react-zoom-pan    │
│  - Fills remaining height                    │
├──────────────────────────────────────────────┤
│  ScriptLabelGrid                             │
│  - Script style buttons grouped by parent   │
│  - Trash button (annotators only)            │
└──────────────────────────────────────────────┘
```

### Classification Task States

A task moves through three annotator/reviewer states:

| `state` value | Who acts | What they do |
|---|---|---|
| `annotating` | Annotator A | Selects a script type |
| `annotating_b` | Annotator B | Selects a script type independently |
| `reviewing` | Reviewer | Picks Annotator A's answer, Annotator B's answer, or their own |

When the reviewer submits, they send a `choice` field (`"a"`, `"b"`, or `"own"`). If `choice === "own"`, a `script_type` is included.

### Annotator Flow

1. App fetches the next task via `GET /tasks/scriptclassification/assign/{userId}`.
2. The image is displayed in `ImageCanvas` (TIFF files are decoded by `utif2`).
3. The annotator clicks a script type in `ScriptLabelGrid`.
4. `POST /tasks/scriptclassification/submit/{taskId}` is called with `{ submit: true, script_type }`.
5. The response includes `next_task`; the query cache is updated directly (no refetch), and the next task's image is preloaded.

### Trash Flow

Annotators can trash a task (mark it unclassifiable):

1. Click the trash icon → `TrashConfirmationDialog` opens.
2. On confirm: `POST /tasks/scriptclassification/submit/{taskId}` with `{ submit: false }`.

Trashed tasks can be restored by an admin from the batch task view.

### Script Styles

31 Tibetan script styles are organised in a two-level hierarchy (parent → children). The full list lives in `src/types/task.ts` as the `ScriptType` union. The UI groups them with `ScriptStyleGroup` → `ScriptLabelCard`.

Helper functions in `src/types/task.ts`:

| Function | Description |
|---|---|
| `getParentStyles(styles)` | Returns styles with no parent |
| `getChildStyles(styles, parentId)` | Returns children of a given parent |
| `getStyleById(styles, id)` | Lookup by ID |
| `getDisplayName(styles, id, lang)` | Returns English or Tibetan name |

**Key components**

| Component | Path |
|---|---|
| `ClassificationWorkspace` | `src/features/workspace/components/script-classification/classification-workspace.tsx` |
| `WorkspaceSidebar` | `src/features/workspace/components/workspace-sidebar.tsx` |
| `ImageCanvas` | `src/features/workspace/components/image-canvas.tsx` |
| `ScriptLabelGrid` | `src/features/workspace/components/script-classification/script-label-grid.tsx` |
| `ScriptStyleGroup` | `src/features/workspace/components/script-classification/script-style-group.tsx` |
| `ScriptLabelCard` | `src/features/workspace/components/script-classification/script-label-card.tsx` |
| `TrashConfirmationDialog` | `src/features/workspace/components/trash-confirmation-dialog.tsx` |

---

## Admin Panel

Available to the **Admin** role only. Accessed via the sidebar.

### Users (`/admin/users`)

Full CRUD for user accounts. The list is paginated and filterable by name, role, and group.

- **Create user** — email, username, role, group assignment.
- **Edit user** — update username, email, role, group.
- **Delete user** — requires confirmation dialog.
- **View contributions** — opens a date-ranged report of tasks the user has annotated/reviewed, showing approval rates and rejection counts.

**Key components**

| Component | Path |
|---|---|
| `AdminUsersPage` | `src/pages/admin/admin-users-page.tsx` |
| `UserList` | `src/features/admin/components/user/user-list.tsx` |
| `UserFilters` | `src/features/admin/components/user/user-filters.tsx` |
| `UserDialog` | `src/features/admin/components/user/user-dialog.tsx` |
| `UserReportDialog` | `src/features/admin/components/user/user-report-dialog.tsx` |
| `UserPagination` | `src/features/admin/components/user/user-pagination.tsx` |

### Groups (`/admin/groups`)

Groups are used to assign batches to sets of users.

- **Create / edit / delete group** — name only.
- Each group card shows the members list (`GET /group/{id}/users`).

**Key components**

| Component | Path |
|---|---|
| `GroupList` | `src/features/admin/components/group/group-list.tsx` |
| `GroupDialog` | `src/features/admin/components/group/group-dialog.tsx` |
| `GroupUserList` | `src/features/admin/components/group/group-user-list.tsx` |

### Batches (`/admin/batches`)

A batch is a named upload of task images assigned to a group.

- **Upload batch** — admin uploads a `.json` file (see format below) and assigns a group. The file is validated client-side before sending.
- **Batch list** — each row shows batch name, group, creation date, and a stacked progress bar (Pending / Half Annotated / Annotated / Accepted / Trashed).
- **Export CSV** — downloads per-task classification results for a batch.

#### Batch JSON Upload Format

```json
[
  {
    "name": "image_001",
    "url": "https://...",
    "orientation": "landscape"
  }
]
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Unique task identifier within the batch |
| `url` | string (URL) | yes | Publicly accessible image URL |
| `orientation` | `"landscape" \| "portrait"` | no | Image orientation hint |

The JSON is validated by `validateBatchFile` in `src/features/admin/components/batch/batch-file-validator.ts` against a Zod schema before being sent to the API.

### Batch Task View (`/admin/batch/:batchId`)

Drilling into a batch shows all its tasks with per-task metadata: state, annotator usernames, classifications A and B, reviewer result, and trashed-by info.

- Tasks can be filtered by state (All / Pending / Half Annotated / Annotated / Accepted / Trashed).
- Admin can **reject** (trash) an accepted task or **restore** a trashed task.
- A preview panel shows the task image alongside the classification details.

**Key components**

| Component | Path |
|---|---|
| `BatchTaskView` | `src/features/admin/components/batch/batch-task-view/batch-task-view.tsx` |
| `TaskListSidebar` | `src/features/admin/components/batch/batch-task-view/task-list-sidebar.tsx` |
| `TaskPreview` | `src/features/admin/components/batch/batch-task-view/task-preview.tsx` |
| `StackedProgressBar` | `src/features/admin/components/batch/progress-bar/stacked-progress-bar.tsx` |
| `BatchStats` | `src/features/admin/components/batch/batch-stats.tsx` |

---

## Internationalisation

The app supports **English** (`en`) and **Tibetan** (`bo`). Translation files are in `src/locales/{lang}/`.

Language preference is stored in `useUIStore` (`language`) and synced to i18next via the `useLanguageSync` hook on every change.

Toggle the language from the settings panel in the sidebar (`LanguageToggle` component).
