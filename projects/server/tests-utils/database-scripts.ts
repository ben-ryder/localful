import {Sql} from "postgres";
import {testUsers} from "@localful/testing";

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

  for (const user of testUsers) {
    await sql`DELETE FROM users where id = ${user.id}`;
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

  // @todo: implement logic for data seeding

  if (options?.logging) {
    console.log("Database seed completed");
  }
}
