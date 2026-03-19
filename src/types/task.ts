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

// Script classification types — 31 styles organized into parent + children
export type ScriptType =
  | 'uchen' | 'uchen_sugthung' | 'uchen_sugdring' | 'uchen_sugring'
  | 'druma' | 'dhumri' | 'druthung' | 'drudring' | 'druring' | 'druchen'
  | 'danyig' | 'tsegdrig' | 'drathung' | 'dradring' | 'draring' | 'gongshabma'
  | 'pedri' | 'peri' | 'petsuk'
  | 'tsugdri' | 'tsugthung' | 'tsugchung' | 'trinyig'
  | 'gyuyig' | 'yigchung' | 'tsumachug' | 'khyuyig'
  | 'multi_scripts'
  | 'other' | 'non_tibetan' | 'difficult'

export interface ScriptStyle {
  id: ScriptType
  name_en: string
  name_bo: string | null
  parent: ScriptType | null
}

export function getParentStyles(styles: ScriptStyle[]): ScriptStyle[] {
  return styles.filter((s) => s.parent === null)
}

export function getChildStyles(styles: ScriptStyle[], parentId: ScriptType): ScriptStyle[] {
  return styles.filter((s) => s.parent === parentId)
}

export function getStyleById(styles: ScriptStyle[], id: ScriptType): ScriptStyle | undefined {
  return styles.find((s) => s.id === id)
}

export function isChildOf(styles: ScriptStyle[], parentId: ScriptType, childId: ScriptType): boolean {
  if (parentId === childId) return true
  return styles.some((s) => s.id === childId && s.parent === parentId)
}

export function getDisplayName(
  styles: ScriptStyle[],
  id: string,
  language: 'en' | 'bo' = 'en',
): string {
  const style = styles.find((s) => s.id === id)
  if (!style) return id
  if (language === 'bo' && style.name_bo) return style.name_bo
  return style.name_en
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

