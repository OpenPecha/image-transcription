// Task status following the state machine
export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  AwaitingReview = 'awaiting_review',
  InReview = 'in_review',
  AwaitingFinalReview = 'awaiting_final_review',
  FinalReview = 'final_review',
  Completed = 'completed',
  Rejected = 'rejected',
}

// Actions that can be recorded in task history
export enum TaskAction {
  Created = 'created',
  Assigned = 'assigned',
  Started = 'started',
  Submitted = 'submitted',
  ClaimedForReview = 'claimed_for_review',
  Approved = 'approved',
  Rejected = 'rejected',
  ClaimedForFinalReview = 'claimed_for_final_review',
  FinalApproved = 'final_approved',
  FinalRejected = 'final_rejected',
  Reassigned = 'reassigned',
  TextUpdated = 'text_updated',
}

// Task history entry for audit trail
export interface TaskHistoryEntry {
  id: string
  action: TaskAction
  userId: string
  userName: string
  timestamp: Date
  comment?: string
  previousStatus?: TaskStatus
  newStatus?: TaskStatus
}

// Main task interface
export interface Task {
  id: string
  imageUrl: string
  imageId?: string
  imageOrder?: number
  noisyText: string
  correctedText: string
  status: TaskStatus
  groupId?: string
  batchName?: string
  assignedTo?: string
  assignedToName?: string
  reviewerId?: string
  reviewerName?: string
  finalReviewerId?: string
  finalReviewerName?: string
  history: TaskHistoryEntry[]
  createdAt: Date
  updatedAt: Date
}

// Task upload JSON schema
export interface TaskUploadItem {
  name: string
  url: string
  transcript: string
}

// Bulk create request/response
export interface BulkCreateTasksRequest {
  tasks: TaskUploadItem[]
  group: string
  batchName: string
}

export interface BulkCreateTasksResponse {
  success: boolean
  created: number
  failed: number
  errors: Array<{ index: number; message: string }>
  tasks: Task[]
}

// Task assignment request
export interface AssignTaskRequest {
  taskId: string
  userId: string
}

// Task orientation type
export type TaskOrientation = 'landscape' | 'portrait'

// Assigned task from real backend API
export interface AssignedTask {
  task_id: string
  task_name: string
  task_url: string
  task_transcript: string
  state: 'annotating' | 'submitted' | 'reviewing' | 'finalising' | 'completed' | 'trashed'
  batch_name: string
  group: string
  orientation?: TaskOrientation
  annotation_rejection_count: number
  review_rejection_count: number
}

// Script classification types — 25 styles organized into core + sub-styles
export type ScriptType =
  | 'Uchen' | 'Sugring' | 'Sugthung' | 'Shachen' | 'Shachung' | 'Zabchen' | 'Zabchung'
  | 'Ume'
  | 'Druma' | 'Dhumri' | 'Druma Sugthung' | 'Druma Sugring' | 'Druchen'
  | 'Danyig' | 'Tsegdrig' | 'Danthung' | 'Danyig Sugring' | 'Gongshabma'
  | 'Tsugdri' | 'Petsug' | 'Peri'
  | 'Cursive' | 'Yigchung' | 'Tsumakhyuk'
  | 'Unknown'

export interface ScriptStyleGroup {
  core: ScriptType
  subStyles: ScriptType[]
}

export const SCRIPT_STYLE_GROUPS: ScriptStyleGroup[] = [
  { core: 'Uchen', subStyles: ['Sugring', 'Sugthung', 'Shachen', 'Shachung', 'Zabchen', 'Zabchung'] },
  { core: 'Ume', subStyles: [] },
  { core: 'Druma', subStyles: ['Dhumri', 'Druma Sugthung', 'Druma Sugring', 'Druchen'] },
  { core: 'Danyig', subStyles: ['Tsegdrig', 'Danthung', 'Danyig Sugring', 'Gongshabma'] },
  { core: 'Tsugdri', subStyles: ['Petsug', 'Peri'] },
  { core: 'Cursive', subStyles: ['Yigchung', 'Tsumakhyuk'] },
  { core: 'Unknown', subStyles: [] },
]

export const SCRIPT_TYPES: ScriptType[] = SCRIPT_STYLE_GROUPS.flatMap(
  (g) => [g.core, ...g.subStyles],
)

export function getGroupForStyle(style: ScriptType): ScriptStyleGroup | undefined {
  return SCRIPT_STYLE_GROUPS.find(
    (g) => g.core === style || g.subStyles.includes(style),
  )
}

export function isSubStyleOf(core: ScriptType, value: ScriptType): boolean {
  const group = SCRIPT_STYLE_GROUPS.find((g) => g.core === core)
  return !!group && (group.core === value || group.subStyles.includes(value))
}

export type ClassificationTaskState = 'annotating' | 'annotating_b' | 'reviewing'

export interface ClassificationTask {
  task_id: string
  state: ClassificationTaskState
  batch_id: string
  group_id: string
  task_name: string
  task_url: string
  orientation: TaskOrientation
  classification_a: ScriptType | null
  classification_b: ScriptType | null
}

export type ReviewerChoice = 'a' | 'b' | 'own'

// Task submission request
export interface SubmitTaskRequest {
  taskId: string
  correctedText: string
}

// Task review request
export interface ReviewTaskRequest {
  taskId: string
  approved: boolean
  comment?: string
}

// Dashboard statistics
export interface DashboardStats {
  pending: number
  inProgress: number
  awaitingReview: number
  completed: number
  rejected: number
  total: number
}

// Filter options for task lists
export interface TaskFilter {
  status?: TaskStatus[]
  assignedTo?: string
  reviewerId?: string
  search?: string
}

// Status display configuration
export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  [TaskStatus.Pending]: { label: 'Pending', color: 'bg-muted text-muted-foreground' },
  [TaskStatus.InProgress]: { label: 'In Progress', color: 'bg-primary/20 text-primary' },
  [TaskStatus.AwaitingReview]: { label: 'Awaiting Review', color: 'bg-warning/20 text-warning' },
  [TaskStatus.InReview]: { label: 'In Review', color: 'bg-accent/20 text-accent' },
  [TaskStatus.AwaitingFinalReview]: { label: 'Awaiting Final Review', color: 'bg-warning/20 text-warning' },
  [TaskStatus.FinalReview]: { label: 'Final Review', color: 'bg-accent/20 text-accent' },
  [TaskStatus.Completed]: { label: 'Completed', color: 'bg-success/20 text-success' },
  [TaskStatus.Rejected]: { label: 'Rejected', color: 'bg-destructive/20 text-destructive' },
}

// Valid status transitions based on the state machine
export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.Pending]: [TaskStatus.InProgress],
  [TaskStatus.InProgress]: [TaskStatus.AwaitingReview],
  [TaskStatus.AwaitingReview]: [TaskStatus.InReview],
  [TaskStatus.InReview]: [TaskStatus.AwaitingFinalReview, TaskStatus.Rejected],
  [TaskStatus.AwaitingFinalReview]: [TaskStatus.FinalReview],
  [TaskStatus.FinalReview]: [TaskStatus.Completed, TaskStatus.Rejected],
  [TaskStatus.Completed]: [],
  [TaskStatus.Rejected]: [TaskStatus.InProgress],
}

