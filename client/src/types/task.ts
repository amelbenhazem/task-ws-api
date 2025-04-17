export type TaskStatus = 'en_cours' | 'termine' | 'annule';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStats {
  total: number;
  enCours: number;
  termine: number;
  annule: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  assignedTo?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  _id: string;
} 