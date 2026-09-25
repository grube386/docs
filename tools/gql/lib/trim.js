/**
 * Returns a copy of `value` where every array holds at most `n` items.
 * It only drops trailing list items: no scalar, key or key order is changed,
 * so `totalCount`, `pageInfo` and every kept item stay exactly as the API sent them.
 */
export function trimLists(value, n) {
  if (Array.isArray(value)) return value.slice(0, n).map((v) => trimLists(v, n));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = trimLists(v, n);
    return out;
  }
  return value;
}

/** Counts removed items, so the CLI can report what --trim did. */
export function countTrimmed(value, n) {
  if (Array.isArray(value)) {
    return Math.max(0, value.length - n) + value.slice(0, n).reduce((s, v) => s + countTrimmed(v, n), 0);
  }
  if (value && typeof value === 'object') return Object.values(value).reduce((s, v) => s + countTrimmed(v, n), 0);
  return 0;
}
