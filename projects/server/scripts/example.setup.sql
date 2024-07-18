-- Cleaning up existing internal if present
DROP DATABASE IF EXISTS localful;

-- Cleaning up existing user if present
DROP USER IF EXISTS localful;

-- Create localful user and internal
CREATE USER localful WITH PASSWORD 'password' LOGIN;
CREATE DATABASE localful;
GRANT CONNECT ON DATABASE localful TO localful;

-- Switch to new database
\c localful

-- Create UUID extension for uuid_generate_v4 support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Functions for automatically managing created_at and updated_at timestamps
CREATE OR REPLACE FUNCTION update_table_timestamps()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

/**
  User Role Enum
  ----------
  Added to users to
 */
CREATE TYPE user_role AS ENUM ('user', 'admin');

/**
    Users Table
    -----------
    Used to store user accounts.
 */
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    role user_role NOT NULL DEFAULT 'user',
    CONSTRAINT email_unique UNIQUE (email),
    CONSTRAINT users_pk PRIMARY KEY (id)
);
CREATE TRIGGER update_user_timestamps BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
    Vaults Table
    -----------
    Used to store vaults.
 */
CREATE TABLE IF NOT EXISTS vaults (
    id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    vault_name VARCHAR(100) NOT NULL,
    protected_encryption_key VARCHAR(255) NOT NULL,
    protected_data TEXT,
    owner_id UUID NOT NULL,
    CONSTRAINT vault_name_unique UNIQUE (owner_id, vault_name),
    CONSTRAINT vaults_pk PRIMARY KEY (id),
    CONSTRAINT vaults_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TRIGGER update_vault_timestamps BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
    Content Table
    -----------
    Used to store content items.
 */
CREATE TABLE IF NOT EXISTS content (
    id UUID NOT NULL,
    content_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    vault_id UUID NOT NULL,
    CONSTRAINT content_pk PRIMARY KEY (id),
    CONSTRAINT content_vault FOREIGN KEY (vault_id) REFERENCES vaults(id) ON DELETE CASCADE
);

/**
    Content Versions Table
    -----------
    Used to store content versions.
 */
CREATE TABLE IF NOT EXISTS content_versions (
    id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    device_identifier VARCHAR(50) NOT NULL,
    protected_data TEXT,
    content_id UUID NOT NULL,
    CONSTRAINT content_versions_pk PRIMARY KEY (id),
    CONSTRAINT content_versions_content FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
);

-- Grant privileges to lfb user after everything is created
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localful;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO localful;
