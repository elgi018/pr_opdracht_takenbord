export const TASK_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
} as const;

export const TASK_STATUS_VALUES = Object.values(TASK_STATUS);
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export interface iTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface iTaskSummary {
  todo: number;
  inProgress: number;
  done: number;
}

export interface TaskFormDialogData {
  task?: iTask;
  mode: 'create' | 'edit';
}

export interface TaskFormDialogResult {
  data: CreateTaskDto | UpdateTaskDto;
  mode: 'create' | 'edit';
  taskId?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
