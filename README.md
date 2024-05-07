---

<div align="center">
<p><b>⚠️ Under Active Development ⚠️</b></p>
<p>This project is early in development and not yet ready for general use.<br>
Expect bugs, missing docs, incomplete features etc!</p>
</div>

---

<div align="center">
  <h1>Localful</h1>
  <p>Full-stack tooling for building local-first web apps with a focus on simplicity, interoperability and longevity.</p>
    <a href="./docs/use-cases.md">Use Cases</a> |
  <a href="./docs/quick-start.md">Quick Start</a> |
  <a href="./docs/readme.md">Documentation</a> |
  <a href="./docs/examples.md">Examples</a> |
  <a href="./docs/local/encryption/specification.md">Encryption Spec</a> |
  <a href="./docs/roadmap.md">Roadmap</a>
</div>

## Why?

- **Simplicity**  

  Software should be simple. Localful doesn't use CRDTs or an advanced distributed database, it accepts the tradeoffs and limitations of a simpler system using immutable versions to store and syncronise data. This allows you to easily understand what's going on and how, so you can spend less time thinking and more time making.
  
- **Interoperability**  

  Your data is yours and should be avaliable without vendor or technology lock-in. Keeping things simple means less reliance on any specific library, langauge or implementation. While Localful is currently focussed on web apps, you could integrate with the server in any langauge using standard HTTP requests, Websockets and without having to rely on any specific database engine.

- **Longevity**  

  If you don't need to manage lots of complexity and build with interoperability in mind, then you can be confident that your application will be easier to manage in the long term and your data will stay avaliable. If you do decide to migrate in the future, you won't need to spend days figuring out how to extract your data.

## Key Features
- Local-first storage using IndexDB.
- Client-side encryption, including locally in IndexDB.
- Schema definitions using [Zod](https://zod.dev/).
- Migration support for schemas and data.
- Basic local queries with support with filtering, ordering, grouping etc.
- Built-in reactivity for local data fetching via [RxJS Observables](https://rxjs.dev/).
- Self-hostable Node.js server for account creation, data storage and cross-device synchronisation.

## Contributions

Feel free to suggest features, give feedback, suggest improvements, raise bugs, open PRs and anything else.

## License

This project is released under the [GNU AGPLv3 license](LICENSE.txt).

