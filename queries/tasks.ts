import { eq, like, desc, and, isNull, lt, gt } from 'drizzle-orm';

import { db } from '../db';
import { tasks } from '../db/schema';
import { simulateNetworkLatency } from './utils';
/**
 * Get all tasks
 */
export const getAllTasks = async () => {
  await simulateNetworkLatency();
  return db.select().from(tasks).all();
};

/**
 * Get task by ID
 */
export const getTaskById = async (id: number) => {
  await simulateNetworkLatency();
  return db.select().from(tasks).where(eq(tasks.id, id)).get();
};

/**
 * Get tasks by list ID
 */
export const getTasksByListId = async (listId: number) => {
  await simulateNetworkLatency();
  return db.select().from(tasks).where(eq(tasks.list_id, listId)).all();
};

/**
 * Create a new task
 */
export const createTask = async (task: {
  name: string;
  description?: string;
  image?: string;
  status?: string;
  priority?: string;
  is_completed?: boolean;
  due_date?: string;
  list_id: number;
}) => {
  await simulateNetworkLatency();
  return db.insert(tasks).values(task).run();
};

/**
 * Update a task
 */
export const updateTask = async (
  id: number,
  task: Partial<{
    name: string;
    description: string;
    image: string;
    status: string;
    priority: string;
    is_completed: boolean;
    due_date: string;
    list_id: number;
  }>
) => {
  await simulateNetworkLatency();
  return db
    .update(tasks)
    .set({
      ...task,
      updated_at: new Date().toISOString(),
    })
    .where(eq(tasks.id, id))
    .run();
};

/**
 * Delete a task
 */
export const deleteTask = async (id: number) => {
  await simulateNetworkLatency();
  return db.delete(tasks).where(eq(tasks.id, id)).run();
};

/**
 * Mark task as completed or not completed
 */
export const toggleTaskCompletion = async (id: number, isCompleted: boolean) => {
  await simulateNetworkLatency();
  return db
    .update(tasks)
    .set({
      is_completed: isCompleted,
      updated_at: new Date().toISOString(),
    })
    .where(eq(tasks.id, id))
    .run();
};

/**
 * Search tasks by name
 */
export const searchTasksByName = async (searchTerm: string) => {
  await simulateNetworkLatency();
  return db
    .select()
    .from(tasks)
    .where(like(tasks.name, `%${searchTerm}%`))
    .all();
};

/**
 * Get tasks by status
 */
export const getTasksByStatus = async (status: string) => {
  await simulateNetworkLatency();
  return db.select().from(tasks).where(eq(tasks.status, status)).all();
};

/**
 * Get tasks by priority
 */
export const getTasksByPriority = async (priority: string) => {
  await simulateNetworkLatency();
  return db.select().from(tasks).where(eq(tasks.priority, priority)).all();
};

/**
 * Get upcoming tasks (tasks with due date in the future)
 */
export const getUpcomingTasks = async () => {
  await simulateNetworkLatency();
  const today = new Date().toISOString();
  return db
    .select()
    .from(tasks)
    .where(and(gt(tasks.due_date, today), eq(tasks.is_completed, false)))
    .orderBy(desc(tasks.due_date))
    .all();
};

/**
 * Get completed tasks
 */
export const getCompletedTasks = async () => {
  await simulateNetworkLatency();
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.is_completed, true))
    .orderBy(desc(tasks.updated_at))
    .all();
};
