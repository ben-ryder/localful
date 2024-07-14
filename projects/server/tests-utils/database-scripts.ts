import {Sql} from "postgres";
import {exampleUsers, testUsers} from "./test-data";

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

  // Deleting users will cascade delete their resources which will cascade delete the related changes too
  for (const user of testUsers) {
    await sql`DELETE FROM users where id = ${user.id}`;
  }

  // Delete example user by email, as they has be created with a different id
  for (const user of exampleUsers) {
    await sql`DELETE FROM users where email = ${user.email}`;
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

  for (const user of testUsers) {
    await sql`
      INSERT INTO users(id, created_at, updated_at, email, password_hash, display_name, is_verified)
      VALUES (${user.id}, ${user.createdAt}, ${user.updatedAt}, ${user.email}, ${user.passwordHash}, ${user.displayName}, ${user.isVerified})
        RETURNING *;
    `;
  }

  if (options?.logging) {
    console.log("Database seed completed");
  }
}
