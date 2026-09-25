import {
  getNamedType,
  isEnumType,
  isInputObjectType,
  parse,
  specifiedRules,
  TypeInfo,
  validate,
  visit,
  visitWithTypeInfo,
} from 'graphql';
import { COMMERCIAL_ONLY, lookupAccess } from './access.js';

const location = (file, loc) => (loc ? `${file}:${loc.line}:${loc.column}` : file);

/**
 * Validates a document against a stored schema, offline. Runs the full set of
 * GraphQL validation rules, which covers unknown fields, unknown or missing
 * arguments, wrong argument types and undeclared variables.
 */
export function checkDocument(schema, source, file) {
  let doc;
  try {
    doc = parse(source);
  } catch (err) {
    return { doc: null, errors: [`${location(file, err.locations?.[0])} syntax: ${err.message}`] };
  }
  const errors = validate(schema, doc, specifiedRules).map((e) => `${location(file, e.locations?.[0])} ${e.message}`);
  return { doc, errors };
}

/** Lists every schema coordinate the document uses that is Commercial only. */
export function commercialOnlyUsages(schema, doc, access, file) {
  const typeInfo = new TypeInfo(schema);
  const notes = new Map();
  const note = (coord, node) => {
    if (!notes.has(coord)) notes.set(coord, `${location(file, node.loc?.startToken && { line: node.loc.startToken.line, column: node.loc.startToken.column })} ${coord} is Commercial only`);
  };
  visit(
    doc,
    visitWithTypeInfo(typeInfo, {
      Field(node) {
        const parent = typeInfo.getParentType();
        if (!parent || node.name.value.startsWith('__')) return;
        // Everything under a Commercial-only type was already reported where the query entered it.
        if (access.types?.[parent.name]?.access === COMMERCIAL_ONLY) return;
        if (lookupAccess(access, parent.name, node.name.value) === COMMERCIAL_ONLY) {
          note(`${parent.name}.${node.name.value}`, node);
          return;
        }
        const named = typeInfo.getType() && getNamedType(typeInfo.getType());
        if (named && access.types?.[named.name]?.access === COMMERCIAL_ONLY) note(`${named.name} (via ${parent.name}.${node.name.value})`, node);
      },
      Argument(node) {
        const parent = typeInfo.getParentType();
        const field = typeInfo.getFieldDef();
        if (!parent || !field) return;
        if (lookupAccess(access, parent.name, field.name, node.name.value) === COMMERCIAL_ONLY) {
          note(`${parent.name}.${field.name}(${node.name.value}:)`, node);
        }
      },
      ObjectField(node) {
        const parent = typeInfo.getParentInputType();
        const named = parent && getNamedType(parent);
        if (named && isInputObjectType(named) && access.types?.[named.name]?.fields?.[node.name.value]?.access === COMMERCIAL_ONLY) {
          note(`${named.name}.${node.name.value}`, node);
        }
      },
      EnumValue(node) {
        const t = typeInfo.getInputType();
        const named = t && getNamedType(t);
        if (named && isEnumType(named) && access.types?.[named.name]?.values?.[node.value]?.access === COMMERCIAL_ONLY) {
          note(`${named.name}.${node.value}`, node);
        }
      },
    }),
  );
  return [...notes.values()];
}
