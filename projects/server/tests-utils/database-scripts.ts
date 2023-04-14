import {Sql} from "postgres";
import {seedProfiles, seedChanges, testCaseProfiles} from "./test-data";

export interface ScriptOptions {
  logging: boolean
}

/**
 * Reset the database to match the predefined test content
 */
export async function resetTestData(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database reset");
  }

  await clearTestData(sql, options);
  await seedTestData(sql, options);
}

/**
 * Clear the given database of all test data
 */
export async function clearTestData(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database clear");
  }

  // Because "on delete cascade" is present on all relationships
  // deleting profiles will automatically delete all related content too.
  for (const profile of seedProfiles) {
    await sql`DELETE FROM profiles where user_id = ${profile.userId}`;
  }

  for (const [key, profile] of Object.entries(testCaseProfiles)) {
    await sql`DELETE FROM profiles where user_id = ${profile.userId}`;
  }

  if (options?.logging) {
    console.log("Database clear completed");
  }
}

/**
 * Seed the given database with the predefined test content
 */
export async function seedTestData(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database seed");
  }

  for (const profile of seedProfiles) {
    await sql`
      INSERT INTO profiles(user_id, encryption_secret, created_at, updated_at)
      VALUES (${profile.userId}, ${profile.encryptionSecret}, ${profile.createdAt}, ${profile.updatedAt})
     `;
  }

  for (const change of seedChanges) {
    await sql`
      INSERT INTO changes(id, data, user_id)
      VALUES (${change.id}, ${change.data}, ${change.user_id})
     `;
  }

  if (options?.logging) {
    console.log("Database seed completed");
  }
}
