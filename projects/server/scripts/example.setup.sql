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
    protected_encryption_key VARCHAR(255) NOT NULL,
    protected_additional_data TEXT,
    CONSTRAINT email_unique UNIQUE (email),
    CONSTRAINT users_pk PRIMARY KEY (id)
);
CREATE TRIGGER update_user_timestamps BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
    Resources Table
    -----------
    Used to store resources.
 */
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(40) NOT NULL,
    protected_encryption_key VARCHAR(255) NOT NULL,
    protected_additional_data TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    owner_id UUID NOT NULL,
    CONSTRAINT resources_pk PRIMARY KEY (id),
    CONSTRAINT resource_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

/**
    Changes Table
    -----------
    Used to store all the changes.
 */
CREATE TABLE IF NOT EXISTS changes (
    id VARCHAR(40) NOT NULL,
    resource_id VARCHAR(40) NOT NULL,
    protected_data TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT changes_pk PRIMARY KEY (id),
    CONSTRAINT change_resource FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    CONSTRAINT unique_resource_change UNIQUE (resource_id, id)
);

-- Grant privileges to lfb user after everything is created
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localful;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO localful;
