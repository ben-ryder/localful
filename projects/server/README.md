# Local-First Backend - Server
This is the main Node server. 

## Setup & Installation

- 0 - Install the prerequisites
   - a. [Postgres](https://www.postgresql.org/) for the database.
- 1 - Set up your databases
  - a. Main database:
    - `cp ./scripts/example.setup.sql ./scripts/local.setup.sql`
    - `psql postgres -f < ./scripts/local.setup.sql`
  - b. E2E testing database:
    - `cp ./scripts/example.setup-e2e.sql ./scripts/local.setup-e2e.sql`
    - `psql postgres -f < ./scripts/local.setup-e2e.sql`
- 2 - Install NPM dependencies
  - `npm install`
- 3 - Setup environment variables
  - `cp .env.example .env`
  - Edit as required to set up secrets, database URLs etc


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# all tests
$ npm run test

# e2e tests
$ npm run test:e2e

# unit tests
$ npm run test:unit

# test coverage
$ npm run test:cov
```
