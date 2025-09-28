import { z } from 'zod';

// Task validation schemas
export const CreateTaskSchema = z.object({
  name: z.string()
    .min(1, 'Task name is required')
    .max(100, 'Task name must be less than 100 characters')
    .trim(),
  list_id: z.number()
    .int('List ID must be an integer')
    .positive('List ID must be positive'),
  priority: z.enum(['low', 'medium', 'high'])
    .default('medium'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  status: z.enum(['pending', 'in_progress', 'completed'])
    .default('pending'),
  due_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .optional(),
  image: z.string().url('Image must be a valid URL').optional(),
});

export const UpdateTaskSchema = z.object({
  id: z.number()
    .int('Task ID must be an integer')
    .positive('Task ID must be positive'),
  name: z.string()
    .min(1, 'Task name is required')
    .max(100, 'Task name must be less than 100 characters')
    .trim()
    .optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
});

export const TaskIdSchema = z.object({
  id: z.number()
    .int('Task ID must be an integer')
    .positive('Task ID must be positive'),
});

export const TaskSearchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters')
    .trim(),
});

export const TaskFilterSchema = z.object({
  status: z.enum(['all', 'completed', 'pending']).default('all'),
  priority: z.enum(['all', 'low', 'medium', 'high']).default('all'),
});

// List validation schemas
export const CreateListSchema = z.object({
  name: z.string()
    .min(1, 'List name is required')
    .max(50, 'List name must be less than 50 characters')
    .trim(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

export const UpdateListSchema = z.object({
  id: z.number()
    .int('List ID must be an integer')
    .positive('List ID must be positive'),
  name: z.string()
    .min(1, 'List name is required')
    .max(50, 'List name must be less than 50 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

export const ListIdSchema = z.object({
  id: z.number()
    .int('List ID must be an integer')
    .positive('List ID must be positive'),
});

export const ListSearchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters')
    .trim(),
});

// Type exports
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskIdInput = z.infer<typeof TaskIdSchema>;
export type TaskSearchInput = z.infer<typeof TaskSearchSchema>;
export type TaskFilterInput = z.infer<typeof TaskFilterSchema>;

export type CreateListInput = z.infer<typeof CreateListSchema>;
export type UpdateListInput = z.infer<typeof UpdateListSchema>;
export type ListIdInput = z.infer<typeof ListIdSchema>;
export type ListSearchInput = z.infer<typeof ListSearchSchema>;
