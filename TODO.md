# TODO

## Server
- Changes:
  - [ ] Implement auth and validation on websockets
- Tests:
  - [ ] Get E2E tests working with the env var `E2E_TESTING_DATABASE_URL` and potentially the test secrets too.
  - [ ] Write tests for changes module
    - [ ] E2E tests for REST API
    - [ ] Unit tests for websockets?
  - [ ] Review all tests, update test cases docs etc
- Auth:
  - [ ] Look at logout/token revocation.
    - I ideally don't want to re-introduce Redis as a dependency just for this.
    - If I'm therefore going to query the db anyway, does session based auth make more sense?
  - [ ] Use proper claims like `sub`, `iss` etc in tokens?
- Users
  - [ ] Implement user verification
  - [ ] Implement user password reset
- Deployments and CI
  - Look at ways to bundle/publish app as docker image for easy deploys

## Toolkit
- Consider how I want to structure the toolkit
  - Should it be generic but all functionality?
  - Should it offer simple piece, but it's up to the app for putting them together
  - How will it work in a React context?
