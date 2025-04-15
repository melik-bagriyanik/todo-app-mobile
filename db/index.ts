import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

export const DATABASE_NAME = 'tasks';
const expoDb = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDb);
