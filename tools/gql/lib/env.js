import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from './config.js';

/** Minimal .env parser: KEY=value, optional quotes, `#` comments, optional `export`. */
export function parseDotenv(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    const quoted = value.match(/^(['"])(.*)\1$/);
    if (quoted) value = quoted[2];
    else value = value.replace(/\s+#.*$/, '');
    out[m[1]] = value;
  }
  return out;
}

let dotenv;
function readDotenv() {
  if (dotenv === undefined) {
    const file = join(REPO_ROOT, '.env');
    dotenv = existsSync(file) ? parseDotenv(readFileSync(file, 'utf8')) : {};
  }
  return dotenv;
}

const loaded = new Set();

/**
 * Each platform has its own key, named by `keyEnv` in apis.json (Commercial:
 * GRID_API_KEY, Open Access: GRID_OA_API_KEY). It comes from the environment
 * first, then from the gitignored `.env` at the repo root. There is no fallback
 * from one platform's key to the other's: a Commercial key on the OA endpoint
 * would not show what an OA customer sees. Never a CLI argument, never printed.
 */
export function getApiKey(envName, platformLabel = envName) {
  if (!envName) throw new Error(`No keyEnv configured for the ${platformLabel} platform in tools/gql/apis.json.`);
  const key = process.env[envName]?.trim() || readDotenv()[envName]?.trim() || '';
  if (!key) {
    throw new Error(`${envName} is not set (key for the ${platformLabel} platform). Export it, or add ${envName}=... to the gitignored .env at the repo root.`);
  }
  loaded.add(key);
  return key;
}

/** Removes every API key used so far from text before it reaches a terminal or a file. */
export function redact(text) {
  let s = String(text);
  for (const key of loaded) s = s.split(key).join('[REDACTED]');
  return s;
}
