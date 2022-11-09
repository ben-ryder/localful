-- Cleaning up existing internal if present
DROP DATABASE IF EXISTS local_first_backend_e2e;

-- Cleaning up existing user if present
DROP USER IF EXISTS local_first_backend_e2e;

-- Create local_first_backend_e2e user and internal
CREATE USER local_first_backend_e2e WITH PASSWORD 'password' LOGIN;
CREATE DATABASE local_first_backend_e2e;
GRANT CONNECT ON DATABASE local_first_backend_e2e TO local_first_backend_e2e;

-- Switch to new internal
\c local_first_backend_e2e

-- Functions for automatically managing created_at and updated_at timestamps
CREATE OR REPLACE FUNCTION update_table_timestamps()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

/**
    Profiles Table
    -----------
    Used to store user profiles.
 */
CREATE TABLE IF NOT EXISTS profiles (
    user_id VARCHAR(100) NOT NULL UNIQUE,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id)
    );
CREATE TRIGGER update_profile_timestamps BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_table_timestamps();

/**
    Changes Table
    -----------
    Used to store all the changes that users make to their content.
 */
CREATE TABLE IF NOT EXISTS changes (
    id VARCHAR(100) NOT NULL UNIQUE,
    user_id VARCHAR(100) NOT NULL,
    data TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
    );

-- Grant privileges to local_first_backend_e2e user after everything is created
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO local_first_backend_e2e;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO local_first_backend_e2e;
