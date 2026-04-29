# Workflows

## User Roles

TextAlign has four roles. Each role has a distinct set of permissions and a dedicated dashboard view.

| Role | Slug | Responsibilities |
|---|---|---|
| **Admin** | `admin` | Manages users, groups, and batches. Does not participate in transcription. |
| **Annotator** | `annotator` | Receives tasks with noisy/OCR text. Corrects the text against the source image and submits for review. |
| **Reviewer** | `reviewer` | Reviews submitted corrections. Can approve (advancing to Final Review) or reject (sending back to the Annotator). |
| **Final Reviewer** | `final reviewer` | Performs the last quality check. Approval marks a task as Gold Standard (`Completed`). Rejection sends it back to the Annotator. |

A new user who logs in without a role is shown the **Pending Approval** screen and cannot access any features until an Admin assigns them a role.

## Task State Machine

Each task moves through a strict sequence of states. The diagram below shows all valid transitions.

```
                ┌──────────┐
                │  Pending  │
                └────┬──────┘
                     │ (admin assigns / annotator claims)
                     ▼
               ┌────────────┐
               │ InProgress │◄─────────────────────────────────┐
               └─────┬──────┘                                  │
                     │ (annotator submits)                      │
                     ▼                                          │
           ┌──────────────────┐                                 │
           │  AwaitingReview  │                                 │
           └────────┬─────────┘                                 │
                    │ (reviewer claims)                          │
                    ▼                                            │
              ┌──────────┐                                       │
              │ InReview  │                                      │
              └──┬────┬───┘                                      │
      (approve)  │    │ (reject)                                 │
                 │    ▼                                          │
                 │  ┌──────────┐                                 │
                 │  │ Rejected │─────────────────────────────────┘
                 │  └──────────┘  (re-assigned to annotator)
                 ▼
  ┌────────────────────────┐
  │  AwaitingFinalReview   │
  └───────────┬────────────┘
              │ (final reviewer claims)
              ▼
       ┌─────────────┐
       │ FinalReview │
       └──┬──────┬───┘
(approve) │      │ (reject)
          │      ▼
          │   ┌──────────┐
          │   │ Rejected │──► InProgress (re-assigned to annotator)
          │   └──────────┘
          ▼
     ┌───────────┐
     │ Completed │  ← Gold Standard
     └───────────┘
```

### State Reference

| State | Meaning |
|---|---|
| `pending` | Task created, not yet assigned |
| `in_progress` | Assigned to an Annotator, being corrected |
| `awaiting_review` | Annotator submitted, waiting for a Reviewer to claim |
| `in_review` | Reviewer has claimed and is reviewing |
| `awaiting_final_review` | Reviewer approved, waiting for a Final Reviewer to claim |
| `final_review` | Final Reviewer has claimed and is reviewing |
| `completed` | Final Reviewer approved — Gold Standard |
| `rejected` | Rejected by Reviewer or Final Reviewer, re-queued for Annotator |

### Rejection Flow

When a task is rejected (at either review tier), it transitions back to `rejected` and is then re-assigned to its original Annotator as `in_progress`. The rejection comment and actor are recorded in the task's audit history. The Annotator can see the rejection reason in the workspace sidebar before making corrections.

Each task tracks independent counters for annotation rejections and review rejections, surfaced in the Admin batch view.

## Task Actions (Audit Trail)

Every state change is recorded as an immutable history entry. Actions available:

| Action | Triggered by |
|---|---|
| `created` | Admin uploads batch |
| `assigned` | Admin or system assigns task |
| `started` | Annotator opens task |
| `submitted` | Annotator submits corrected text |
| `claimed_for_review` | Reviewer picks up task |
| `approved` | Reviewer approves |
| `rejected` | Reviewer rejects |
| `claimed_for_final_review` | Final Reviewer picks up task |
| `final_approved` | Final Reviewer approves |
| `final_rejected` | Final Reviewer rejects |
| `reassigned` | Admin reassigns task manually |
| `text_updated` | Annotator saves a draft |

## Workspace Editor

The workspace is the primary working view for Annotators, Reviewers, and Final Reviewers.

**Layout**: The image viewer occupies the left panel; the text editor occupies the right. A sidebar shows task metadata, history, and navigation.

**Image Viewer**:
- Pan and zoom with mouse or trackpad
- TIFF files are supported (decoded in-browser via `utif2`)
- Keyboard shortcuts: `Ctrl/Cmd + +/-/0`

**Text Editor**:
- Font family and size are configurable per user (persisted in localStorage)
- Drafts auto-saved with `Ctrl/Cmd + S`
- Submit and Approve/Reject actions are in the toolbar

## Admin Workflows

### Batch Upload

1. Go to **Admin → Batches → Create Batch**.
2. Upload a CSV or JSON file containing task entries (`name`, `url`, `transcript`).
3. Assign the batch to a **Group**.
4. Tasks are created in bulk and enter the `pending` state.

### User Management

1. Go to **Admin → Users**.
2. Create a user by email — they receive an Auth0 invitation.
3. Assign a **Role** and a **Group** (optional).
4. Users can be updated or removed at any time.

### Group Management

Groups organize users and batches together. A user belongs to one group; a batch is assigned to one group. This allows admins to scope work to specific teams.
