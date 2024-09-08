import {Sql} from "postgres";
import {exampleUser1, testAdminUser1, testAdminUser2Unverified, testUser1, testUser2Unverified} from "./data/users.js";
import {testAdminUser1Vault1, testUser1Vault1, testUser1Vault2} from "./data/vaults.js";

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
  for (const user of [testUser1, testUser2Unverified, testAdminUser1, testAdminUser2Unverified]) {
    await sql`DELETE FROM users where id = ${user.id}`;
  }

  // Delete example user by email, as they will be created with a random id
  for (const user of [exampleUser1]) {
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

  for (const user of [testUser1, testUser2Unverified, testAdminUser1, testAdminUser2Unverified]) {
    await sql`
      INSERT INTO users(id, email, display_name, password_hash, verified_at, first_verified_at, role, created_at, updated_at)
      VALUES (${user.id}, ${user.email}, ${user.displayName}, ${user.passwordHash}, ${user.verifiedAt}, ${user.firstVerifiedAt}, ${user.role}, ${user.createdAt}, ${user.updatedAt})
    `;
  }

  for (const vault of [testUser1Vault1, testUser1Vault2, testAdminUser1Vault1]) {
    await sql`
      INSERT INTO vaults(id, vault_name, protected_encryption_key, protected_data, owner_id, created_at, updated_at, deleted_at)
      VALUES (${vault.id}, ${vault.name}, ${vault.protectedEncryptionKey}, ${vault.protectedData || null}, ${vault.ownerId}, ${vault.createdAt}, ${vault.updatedAt}, ${vault.deletedAt})
    `;
  }

  if (options?.logging) {
    console.log("Database seed completed");
  }
}
