import {
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isIntrospectionType,
  isObjectType,
  isSpecifiedScalarType,
  isUnionType,
} from 'graphql';

export const BOTH = 'both';
export const COMMERCIAL_ONLY = 'commercial-only';
export const OPEN_ACCESS_ONLY = 'open-access-only';

export const LEGEND = {
  [BOTH]: 'Available on Commercial (api.grid.gg) and Open Access (api-op.grid.gg).',
  [COMMERCIAL_ONLY]: 'Available on Commercial only. Pages badge it "Not available on OA".',
  [OPEN_ACCESS_ONLY]: 'Present on Open Access but not on Commercial. Unexpected: report it, do not document it.',
};

// Apollo Federation plumbing: served by the gateway, not part of the documented API.
export const FEDERATION_NAMES = ['_entities', '_service', '_Any', '_Entity', '_FieldSet', '_Service', '_Placeholder'];
const isFederation = (name) => FEDERATION_NAMES.includes(name);

const accessOf = (inC, inO) => (inC && inO ? BOTH : inC ? COMMERCIAL_ONLY : OPEN_ACCESS_ONLY);

function newSummary() {
  const bucket = () => ({ [BOTH]: 0, [COMMERCIAL_ONLY]: 0, [OPEN_ACCESS_ONLY]: 0 });
  return { operations: bucket(), types: bucket(), fields: bucket(), arguments: bucket(), enumValues: bucket() };
}

const byName = (list) => new Map((list ?? []).map((x) => [x.name, x]));
const sortedUnion = (a, b) => [...new Set([...a.keys(), ...b.keys()])].sort();

/** Diffs arguments (or input fields): presence per platform, plus type/default drift. */
function diffInputs(cList, oList, summary, bucket) {
  const c = byName(cList);
  const o = byName(oList);
  const out = {};
  for (const name of sortedUnion(c, o)) {
    const entry = { access: accessOf(c.has(name), o.has(name)) };
    if (c.has(name) && o.has(name)) {
      const ct = String(c.get(name).type);
      const ot = String(o.get(name).type);
      if (ct !== ot) entry.typeDiffers = { commercial: ct, 'open-access': ot };
    }
    summary[bucket][entry.access]++;
    out[name] = entry;
  }
  return out;
}

function diffFields(cType, oType, summary) {
  const fieldsOf = (t) => (t ? Object.values(t.getFields()).filter((f) => !isFederation(f.name)) : []);
  const c = byName(fieldsOf(cType));
  const o = byName(fieldsOf(oType));
  const out = {};
  for (const name of sortedUnion(c, o)) {
    const cf = c.get(name);
    const of = o.get(name);
    const entry = { access: accessOf(!!cf, !!of) };
    if (cf && of && String(cf.type) !== String(of.type)) {
      entry.typeDiffers = { commercial: String(cf.type), 'open-access': String(of.type) };
    }
    const args = diffInputs(cf?.args, of?.args, summary, 'arguments');
    if (Object.keys(args).length) entry.args = args;
    summary.fields[entry.access]++;
    out[name] = entry;
  }
  return out;
}

function kindOf(t) {
  if (isObjectType(t)) return 'OBJECT';
  if (isInterfaceType(t)) return 'INTERFACE';
  if (isUnionType(t)) return 'UNION';
  if (isEnumType(t)) return 'ENUM';
  if (isInputObjectType(t)) return 'INPUT_OBJECT';
  return 'SCALAR';
}

/**
 * Builds the access map for one API from its Commercial and Open Access schemas.
 * Root operation types appear under `operations`, every other named type under `types`.
 */
export function diffAccess(commercial, openAccess, meta) {
  const summary = newSummary();
  const operations = {};
  const rootNames = new Set();
  const roots = {};

  for (const [opKind, getter] of [['query', 'getQueryType'], ['mutation', 'getMutationType'], ['subscription', 'getSubscriptionType']]) {
    const cRoot = commercial[getter]();
    const oRoot = openAccess[getter]();
    if (cRoot) rootNames.add(cRoot.name);
    if (oRoot) rootNames.add(oRoot.name);
    if (!cRoot && !oRoot) continue;
    roots[opKind] = (cRoot ?? oRoot).name;
    // Operations are the root type's fields; counted as operations, not as fields.
    const scratch = newSummary();
    const ops = diffFields(cRoot, oRoot, scratch);
    for (const k of Object.keys(scratch.arguments)) summary.arguments[k] += scratch.arguments[k];
    for (const op of Object.values(ops)) summary.operations[op.access]++;
    operations[opKind] = ops;
  }

  const namedTypes = (schema) =>
    new Map(
      Object.values(schema.getTypeMap())
        .filter((t) => !isIntrospectionType(t) && !isSpecifiedScalarType(t) && !rootNames.has(t.name) && !isFederation(t.name))
        .map((t) => [t.name, t]),
    );
  const cTypes = namedTypes(commercial);
  const oTypes = namedTypes(openAccess);

  const types = {};
  for (const name of sortedUnion(cTypes, oTypes)) {
    const ct = cTypes.get(name);
    const ot = oTypes.get(name);
    const ref = ct ?? ot;
    const entry = { kind: kindOf(ref), access: accessOf(!!ct, !!ot) };
    if (ct && ot && kindOf(ct) !== kindOf(ot)) entry.kindDiffers = { commercial: kindOf(ct), 'open-access': kindOf(ot) };
    summary.types[entry.access]++;

    if (isObjectType(ref) || isInterfaceType(ref)) {
      entry.fields = diffFields(ct && (isObjectType(ct) || isInterfaceType(ct)) ? ct : null, ot && (isObjectType(ot) || isInterfaceType(ot)) ? ot : null, summary);
    } else if (isInputObjectType(ref)) {
      const fieldsOf = (t) => (t && isInputObjectType(t) ? Object.values(t.getFields()) : []);
      entry.fields = diffInputs(fieldsOf(ct), fieldsOf(ot), summary, 'fields');
    } else if (isEnumType(ref)) {
      const valuesOf = (t) => (t && isEnumType(t) ? t.getValues() : []);
      const c = byName(valuesOf(ct));
      const o = byName(valuesOf(ot));
      entry.values = {};
      for (const v of sortedUnion(c, o)) {
        const access = accessOf(c.has(v), o.has(v));
        summary.enumValues[access]++;
        entry.values[v] = { access };
      }
    } else if (isUnionType(ref)) {
      const membersOf = (t) => (t && isUnionType(t) ? t.getTypes() : []);
      const c = byName(membersOf(ct));
      const o = byName(membersOf(ot));
      entry.members = {};
      for (const m of sortedUnion(c, o)) entry.members[m] = { access: accessOf(c.has(m), o.has(m)) };
    }
    types[name] = entry;
  }

  return { api: meta.api, platforms: meta.platforms, legend: LEGEND, excluded: FEDERATION_NAMES, summary, roots, operations, types };
}

/** Looks up a coordinate such as `Query.allSeries`, `Query.allSeries(filter:)`, `Series.teams`. */
export function lookupAccess(access, typeName, fieldName, argName) {
  let field;
  for (const [kind, ops] of Object.entries(access.operations ?? {})) {
    if (access.roots?.[kind] === typeName) field = ops[fieldName];
  }
  if (!field) field = access.types?.[typeName]?.fields?.[fieldName];
  if (!field) return undefined;
  return argName ? field.args?.[argName]?.access : field.access;
}
