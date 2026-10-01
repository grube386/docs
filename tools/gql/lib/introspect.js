import { buildClientSchema, lexicographicSortSchema, printSchema } from 'graphql';
import { request } from './client.js';

// Seven levels of ofType covers any realistic wrapping ([[T!]!]! and deeper).
const TYPE_REF = 'kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } }';

/**
 * A full introspection query is refused by graphql-java's GoodFaithIntrospection
 * check (api-op.grid.gg answers `BadFaithIntrospection`): each introspection field
 * (`__type`, `__Type.fields`, `__Type.inputFields`, ...) may appear only once per
 * query, and aliasing several `__type` lookups is refused too. So the schema is
 * fetched as several `__schema` queries, each touching every such field at most
 * once, and merged by type name.
 */
export const PARTS = {
  roots: `query IntrospectRoots {
  __schema {
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types { kind name description }
  }
}`,
  fields: `query IntrospectFields {
  __schema {
    types {
      name
      fields(includeDeprecated: true) {
        name description isDeprecated deprecationReason
        args(includeDeprecated: true) { name description defaultValue isDeprecated deprecationReason type { ${TYPE_REF} } }
        type { ${TYPE_REF} }
      }
    }
  }
}`,
  inputFields: `query IntrospectInputFields {
  __schema {
    types {
      name
      inputFields(includeDeprecated: true) { name description defaultValue isDeprecated deprecationReason type { ${TYPE_REF} } }
    }
  }
}`,
  shapes: `query IntrospectShapes {
  __schema {
    types {
      name
      enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason }
      interfaces { ${TYPE_REF} }
      possibleTypes { ${TYPE_REF} }
    }
  }
}`,
  directives: `query IntrospectDirectives {
  __schema {
    directives {
      name description isRepeatable locations
      args(includeDeprecated: true) { name description defaultValue isDeprecated deprecationReason type { ${TYPE_REF} } }
    }
  }
}`,
};

// Older servers may not support includeDeprecated on args / input fields, or isRepeatable.
const FALLBACKS = {
  fields: (q) => q.replace('args(includeDeprecated: true) { name description defaultValue isDeprecated deprecationReason', 'args { name description defaultValue'),
  inputFields: (q) => q.replace('inputFields(includeDeprecated: true) { name description defaultValue isDeprecated deprecationReason', 'inputFields { name description defaultValue'),
  directives: (q) => q.replace('isRepeatable ', '').replace('args(includeDeprecated: true) { name description defaultValue isDeprecated deprecationReason', 'args { name description defaultValue'),
};

export class GraphQLResponseError extends Error {
  constructor(label, errors) {
    super(`${label}: ${errors.map((e) => e.message + (e.extensions?.classification ? ` [${e.extensions.classification}]` : '')).join('; ')}`);
    this.errors = errors;
  }
}

async function fetchPart(endpoint, name, log) {
  let query = PARTS[name];
  let res = await request(endpoint, query, undefined, { log });
  if (res.errors?.length && FALLBACKS[name]) {
    log(`part "${name}" refused (${res.errors[0].message}); retrying with the reduced query`);
    query = FALLBACKS[name](query);
    res = await request(endpoint, query, undefined, { log });
  }
  if (res.errors?.length) throw new GraphQLResponseError(`${endpoint.url} introspection part "${name}"`, res.errors);
  return res.data.__schema;
}

/** Merges the partial results into the standard IntrospectionQuery shape. */
export function mergeParts(parts) {
  const byName = new Map(parts.roots.types.map((t) => [t.name, { ...t }]));
  const fill = (list, keys) => {
    for (const t of list ?? []) {
      const target = byName.get(t.name);
      if (!target) continue; // a type the roots query did not list is not part of the schema
      for (const k of keys) target[k] = t[k];
    }
  };
  fill(parts.fields.types, ['fields']);
  fill(parts.inputFields.types, ['inputFields']);
  fill(parts.shapes.types, ['enumValues', 'interfaces', 'possibleTypes']);
  return {
    __schema: {
      queryType: parts.roots.queryType,
      mutationType: parts.roots.mutationType,
      subscriptionType: parts.roots.subscriptionType,
      types: [...byName.values()],
      directives: parts.directives.directives,
    },
  };
}

export async function introspect(endpoint, { log = () => {} } = {}) {
  const parts = {};
  for (const name of Object.keys(PARTS)) {
    log(`${endpoint.platformLabel}: fetching ${name}`);
    parts[name] = await fetchPart(endpoint, name, log);
  }
  const result = mergeParts(parts);
  const schema = lexicographicSortSchema(buildClientSchema(result));
  return { schema, sdl: printSchema(schema) + '\n' };
}
