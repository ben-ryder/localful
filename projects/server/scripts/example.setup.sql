-- Cleaning up existing internal if present
DROP DATABASE IF EXISTS localful;

-- Cleaning up existing user if present
DROP USER IF EXISTS localful;

-- Create lfb user and internal
CREATE USER localful WITH PASSWORD 'password' LOGIN;
CREATE DATABASE localful;
GRANT CONNECT ON DATABASE localful TO localful;

-- Switch to new internal
\c lfb

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
    Users Table
    -----------
    Used to store user accounts.
 */
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    encrypted_vault_key VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_pk PRIMARY KEY (id)
);
CREATE TRIGGER update_user_timestamps BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
    Changes Table
    -----------
    Used to store all the changes.
 */
CREATE TABLE IF NOT EXISTS changes (
    id VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    data TEXT NOT NULL,
    owner_id UUID NOT NULL,
    CONSTRAINT changes_pk PRIMARY KEY (id),
    CONSTRAINT change_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (id, resource_id)
);

-- Grant privileges to lfb user after everything is created
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localful;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO localful;
