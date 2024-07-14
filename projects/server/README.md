# Localful - Server
The Localful server is developed using [NestJS](https://nestjs.com/) (Node.js/Express) and provides an HTTP API and websocket
server for syncing content between devices, backing up content to the server and managing user accounts.

## Before you begin
- [PostgreSQL](https://www.postgresql.org/) is required to run the database. You must also set up the database as per the example in `scripts/example.setup.sql`.
- Redis


## Setting up the app

```bash
# setup database
# this will create an `localful` user & db, you can edit the script as required
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
