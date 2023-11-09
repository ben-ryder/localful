# Local-First Backend - Server
The LFB server is developed using [NestJS](https://nestjs.com/) (Node.js/Express) and provides a REST API and websocket
support for syncing changes between devices, backing up content and managing user profiles.  
The server itself does not handle user management, but it designed to integrate with third party identity services.

## Before you begin
- [PostgreSQL](https://www.postgresql.org/) is required to run the database.
- A third party identify service such as [Logto](https://logto.io/) must be setup to handle user management and authentication. For the requirements this provider must meet, check the [authentication docs](../../docs/authentication-rbac.md).


## Setting up the app

```bash
# setup database
# this will create an `lfb` user & db, you can edit the script as required
$ cp ./scripts/example.setup.sql ./scripts/example.setup.sql
$ psql postgres -f < ./scripts/setup.sql

# install dependencies
$ npm install

# setup environment
# you will have to configure the AUTH_ variables and DATABASE_URL if you edited the setup.sql script
$ cp .env.example .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing the app

```bash
# all tests
$ npm run test

# e2e tests
$ npm run test:e2e

# unit tests
$ npm run test:unit

# check test coverage
$ npm run test:cov
```
