import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSchema, parse, printSchema, buildClientSchema, getIntrospectionQuery, graphqlSync } from 'graphql';
import { diffAccess, lookupAccess } from '../lib/access.js';
import { checkDocument, commercialOnlyUsages } from '../lib/check.js';
import { backoffMs } from '../lib/client.js';
import { getApiKey, parseDotenv, redact } from '../lib/env.js';
import { resolveApi } from '../lib/config.js';
import { mergeParts, PARTS } from '../lib/introspect.js';
import { countTrimmed, trimLists } from '../lib/trim.js';

const COMMERCIAL = buildSchema(`
  type Query { allSeries(first: Int, filter: SeriesFilter, secret: Boolean): SeriesConnection! internal: Internal }
  type Mutation { createSeries(name: String!): Series }
  type SeriesConnection { totalCount: Int! edges: [Series!]! }
  type Series { id: ID! name: String private: Boolean }
  type Internal { id: ID! }
  input SeriesFilter { titleId: ID hidden: Boolean }
  enum Kind { A B }
`);
const OPEN_ACCESS = buildSchema(`
  type Query { allSeries(first: Int, filter: SeriesFilter): SeriesConnection! _service: _Service! }
  type SeriesConnection { totalCount: Int! edges: [Series!]! }
  type Series { id: ID! name: String! }
  type _Service { sdl: String }
  input SeriesFilter { titleId: ID }
  enum Kind { A }
`);

test('trimLists drops only list items beyond N and keeps every value', () => {
  const input = { data: { totalCount: 5, pageInfo: { hasNextPage: true }, edges: [{ n: 1, tags: ['a', 'b', 'c'] }, { n: 2 }, { n: 3 }] } };
  const out = trimLists(input, 2);
  assert.deepEqual(out, { data: { totalCount: 5, pageInfo: { hasNextPage: true }, edges: [{ n: 1, tags: ['a', 'b'] }, { n: 2 }] } });
  assert.equal(countTrimmed(input, 2), 2);
  assert.equal(input.data.edges.length, 3, 'input is not mutated');
  assert.deepEqual(trimLists({ a: null, b: 0, c: '' }, 0), { a: null, b: 0, c: '' });
});

test('parseDotenv handles quotes, comments and export', () => {
  const env = parseDotenv('# c\nexport GRID_API_KEY="abc def"\nOTHER=x # note\nEMPTY=\nbad line\n');
  assert.deepEqual(env, { GRID_API_KEY: 'abc def', OTHER: 'x', EMPTY: '' });
});

test('backoff grows exponentially, is capped and honours Retry-After', () => {
  assert.equal(backoffMs(0), 1000);
  assert.equal(backoffMs(3), 8000);
  assert.equal(backoffMs(10), 32000);
  assert.equal(backoffMs(0, 5000), 5000);
});

test('split introspection parts merge into a schema equal to a full introspection', () => {
  const run = (q) => graphqlSync({ schema: COMMERCIAL, source: q }).data.__schema;
  const parts = Object.fromEntries(Object.entries(PARTS).map(([k, q]) => [k, run(q)]));
  const merged = buildClientSchema(mergeParts(parts));
  const full = buildClientSchema(graphqlSync({ schema: COMMERCIAL, source: getIntrospectionQuery({ inputValueDeprecation: true }) }).data);
  assert.equal(printSchema(merged), printSchema(full));
});

test('each introspection part uses every guarded introspection field at most once', () => {
  for (const [name, q] of Object.entries(PARTS)) {
    for (const f of ['__schema', '__type', 'fields(', 'inputFields', 'enumValues', 'interfaces', 'possibleTypes', 'directives']) {
      const count = q.split(f).length - 1;
      assert.ok(count <= 1, `${name}: "${f}" appears ${count} times`);
    }
  }
});

test('diffAccess marks Commercial-only items and type drift, and skips federation plumbing', () => {
  const a = diffAccess(COMMERCIAL, OPEN_ACCESS, { api: 't', platforms: {} });
  assert.equal(a.operations.query.allSeries.access, 'both');
  assert.equal(a.operations.query.allSeries.args.secret.access, 'commercial-only');
  assert.equal(a.operations.query.internal.access, 'commercial-only');
  assert.equal(a.operations.mutation.createSeries.access, 'commercial-only');
  assert.equal(a.operations.query._service, undefined);
  assert.equal(a.types._Service, undefined);
  assert.equal(a.types.Internal.access, 'commercial-only');
  assert.equal(a.types.Series.fields.private.access, 'commercial-only');
  assert.deepEqual(a.types.Series.fields.name.typeDiffers, { commercial: 'String', 'open-access': 'String!' });
  assert.equal(a.types.SeriesFilter.fields.hidden.access, 'commercial-only');
  assert.equal(a.types.Kind.values.B.access, 'commercial-only');
  assert.equal(a.summary.operations['open-access-only'], 0);
  assert.equal(lookupAccess(a, 'Query', 'allSeries', 'secret'), 'commercial-only');
  assert.equal(lookupAccess(a, 'Series', 'id'), 'both');
});

test('checkDocument reports unknown fields and arguments with locations', () => {
  const { errors } = checkDocument(COMMERCIAL, '{ allSeries(sortBy: 1) { edges { nmae } } }', 'q.graphql');
  assert.equal(errors.length, 2);
  assert.match(errors[0], /^q\.graphql:1:13 Unknown argument "sortBy"/);
  assert.match(errors[1], /Cannot query field "nmae" on type "Series"/);
  assert.deepEqual(checkDocument(COMMERCIAL, '{ allSeries(first: 2) { totalCount } }', 'q').errors, []);
  assert.match(checkDocument(COMMERCIAL, '{ allSeries {', 'q').errors[0], /syntax/);
});

test('commercialOnlyUsages lists each Commercial-only coordinate once', () => {
  const a = diffAccess(COMMERCIAL, OPEN_ACCESS, { api: 't', platforms: {} });
  const src = '{ allSeries(secret: true, filter: { hidden: true }) { edges { id private } } internal { id } }';
  const notes = commercialOnlyUsages(COMMERCIAL, parse(src), a, 'q');
  const coords = notes.map((n) => n.replace(/^\S+ /, '').replace(/ is Commercial only$/, ''));
  assert.deepEqual(coords.sort(), ['Query.allSeries(secret:)', 'Query.internal', 'Series.private', 'SeriesFilter.hidden']);
});

test('request retries on HTTP 429, sends the key as a header and never in the body', async () => {
  const { createServer } = await import('node:http');
  const { request } = await import('../lib/client.js');
  process.env.GQL_TEST_KEY = 'test-key-123';
  const seen = [];
  const server = createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      seen.push({ key: req.headers['x-api-key'], body });
      if (seen.length === 1) {
        res.writeHead(429, { 'retry-after': '0' }).end('slow down');
      } else {
        res.writeHead(200, { 'content-type': 'application/json' }).end('{"data":{"ok":true}}');
      }
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const endpoint = { url: `http://127.0.0.1:${server.address().port}/`, keyEnv: 'GQL_TEST_KEY', platformLabel: 'Test', requestsPerSecond: 50, timeoutMs: 5000, maxRetries: 2 };
  const logs = [];
  try {
    const res = await request(endpoint, '{ ok }', undefined, { log: (m) => logs.push(m) });
    assert.deepEqual(res, { data: { ok: true } });
  } finally {
    server.close();
  }
  assert.equal(seen.length, 2);
  assert.ok(seen.every((s) => s.key === 'test-key-123' && !s.body.includes('test-key-123')));
  assert.match(logs[0], /HTTP 429, retrying in 1000 ms/);
});

test('each platform reads its own key, with no fallback to the other', () => {
  assert.equal(resolveApi('central-data', 'commercial').keyEnv, 'GRID_API_KEY');
  assert.equal(resolveApi('central-data', 'open-access').keyEnv, 'GRID_OA_API_KEY');
  process.env.GQL_TEST_C = 'commercial-secret';
  delete process.env.GQL_TEST_MISSING;
  assert.equal(getApiKey('GQL_TEST_C', 'Commercial'), 'commercial-secret');
  assert.throws(() => getApiKey('GQL_TEST_MISSING', 'Open Access'), /GQL_TEST_MISSING is not set \(key for the Open Access platform\)/);
  assert.equal(redact('x commercial-secret y'), 'x [REDACTED] y');
});
