import { eq, like, desc } from 'drizzle-orm';

import { db } from '../db';
import { simulateNetworkLatency } from './utils';
import { lists } from '../db/schema';

/**
 * Get all lists
 */
export const getAllLists = async () => {
  await simulateNetworkLatency();
  return db.select().from(lists).all();
};

/**
 * Get a list by ID
 */
export const getListById = async (id: number) => {
  await simulateNetworkLatency();
  return db.select().from(lists).where(eq(lists.id, id)).get();
};

/**
 * Create a new list
 */
export const createList = async (name: string) => {
  await simulateNetworkLatency();
  return db
    .insert(lists)
    .values({
      name,
    })
    .run();
};

/**
 * Update a list
 */
export const updateList = async (id: number, name: string) => {
  await simulateNetworkLatency();
  return db
    .update(lists)
    .set({
      name,
      updated_at: new Date().toISOString(),
    })
    .where(eq(lists.id, id))
    .run();
};

/**
 * Delete a list
 */
export const deleteList = async (id: number) => {
  await simulateNetworkLatency();
  return db.delete(lists).where(eq(lists.id, id)).run();
};

/**
 * Get list by name (search)
 */
export const searchListsByName = async (searchTerm: string) => {
  await simulateNetworkLatency();
  return db
    .select()
    .from(lists)
    .where(like(lists.name, `%${searchTerm}%`))
    .all();
};

/**
 * Get most recently created lists
 */
export const getRecentLists = async (limit = 5) => {
  await simulateNetworkLatency();
  return db.select().from(lists).orderBy(desc(lists.created_at)).limit(limit).all();
};
