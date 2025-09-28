import { tasks, lists } from '@/db/schema';
import { BaseEntity, Priority, TaskStatus } from './types/common';

export type Task = typeof tasks.$inferSelect;
export type List = typeof lists.$inferSelect;

// Enhanced types with better type safety
export interface TaskWithList extends Task {
  list?: List;
}

export interface ListWithTaskCount extends List {
  task_count?: number;
  completed_count?: number;
}

// Re-export common types
export type { BaseEntity, Priority, TaskStatus } from './types/common';
