# gql: GraphQL CLI for the GRID docs

Node.js 20+, no build step. One dependency (`graphql`).

```bash
cd tools/gql && npm install      # once
node tools/gql/gql.js <command>  # from the repo root
```

`npm link` inside `tools/gql` puts a `gql` command on your PATH.

## API keys

Each platform needs its own key, named in `apis.json` (`keyEnv`):

| Platform | Endpoint host | Variable |
| --- | --- | --- |
| Commercial | `api.grid.gg` | `GRID_API_KEY` |
| Open Access | `api-op.grid.gg` | `GRID_OA_API_KEY` |

Each is read from the environment first, then from the gitignored `.env` at
the repo root. There is no fallback from one key to the other: a Commercial
key on the OA endpoint would not show what an OA customer sees. Keys are never
accepted as arguments, never written to a file and redacted from every message
the tool prints. `introspect` checks both keys before it sends any request.

## Commands

| Command | What it does | Calls the API |
| --- | --- | --- |
| `gql introspect <api> [--platform <p>]` | Writes `schemas/<api>.graphql` (Commercial) and `schemas/<api>.open-access.graphql`. | yes |
| `gql access <api>` | Diffs the two stored schemas into `schemas/<api>.access.json`. | no |
| `gql run <file.graphql> --api <api> [--vars <file.json>] [--platform <p>] [--operation <name>] [--trim N] [--out <file>]` | Runs a query (Commercial by default). Prints the response, or writes it with `--out`. Exit code 1 if the response has GraphQL errors. | yes |
| `gql check <file.graphql>... --api <api> [--vars <file.json>] [--platform <p>]` | Validates documents against the stored SDL. With `--vars`, also validates the variable values. Prints a `note` for every Commercial-only field, argument, input field or enum value used. | no |

APIs and platforms are listed in `apis.json`. Add an API there as its phase starts.

### Rules the tool enforces

- `--trim N` keeps at most N items in every list. It never changes a value, a
  key or the key order, so `totalCount` and `pageInfo` stay real. Use it only
  for nested lists that no query argument can limit (spec section 5a).
- Requests are throttled to `requestsPerSecond` (default 1). HTTP 429, 502, 503
  and 504 are retried with exponential backoff (1 s, 2 s, 4 s... capped at 32 s,
  or `Retry-After` when longer), up to `maxRetries`.
- `check --platform open-access` answers "does this example run on OA?".

### Why introspection is split

`api-op.grid.gg` runs graphql-java's GoodFaithIntrospection check. It refuses
the standard introspection query, and any query that uses `__type`,
`__Type.fields`, `__Type.inputFields` and so on more than once (aliases count).
`introspect` therefore sends five `__schema` queries (roots, fields with args,
input fields, enum values with interfaces and possible types, directives) and
merges them. Both platforms go through the same path, so the two SDL files are
comparable. The SDL is sorted, so a re-run only shows real schema changes.

### Access file

`schemas/<api>.access.json` marks every operation, type, field, argument,
input field and enum value as `both` or `commercial-only`, and records
`typeDiffers` when a field has a different type on each platform (for example
`Title.private`: `Boolean` on Commercial, `Boolean!` on Open Access). Apollo
Federation plumbing (`_entities`, `_service`, `_Any`...) is excluded; it is
listed under `excluded`.

## Examples

Example queries live in `examples/<api>/<section>/<name>/` as
`<variant>.graphql`, `<variant>.vars.json` and the captured
`<variant>.response.json`:

```bash
D=examples/central-data/queries/allSeries
node tools/gql/gql.js check $D/full.graphql --api central-data --vars $D/full.vars.json
node tools/gql/gql.js run   $D/full.graphql --api central-data --vars $D/full.vars.json --out $D/full.response.json
```

## Tests

```bash
cd tools/gql && npm test   # offline, no key needed
```

Not built yet: `gql record` (subscriptions and WebSocket), which comes with
the Odds and Series Events rollouts.
