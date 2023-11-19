import {Sql} from "postgres";
import {testUsers} from "./test-data";

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
      INSERT INTO users(id, display_name, email, password_hash, is_verified, role , protected_encryption_key, protected_additional_data, created_at, updated_at)
      VALUES (${user.id}, ${user.displayName}, ${user.email}, ${user.passwordHash}, ${user.isVerified}, ${user.role}, ${user.protectedEncryptionKey}, ${user.protectedAdditionalData || null}, ${user.createdAt}, ${user.updatedAt})
        RETURNING *;
    `;
  }

  if (options?.logging) {
    console.log("Database seed completed");
  }
}
