import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TOOL_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = resolve(TOOL_DIR, '..', '..');
export const SCHEMAS_DIR = join(REPO_ROOT, 'schemas');

export class UsageError extends Error {}

let cached;
export function loadConfig() {
  if (!cached) cached = JSON.parse(readFileSync(join(TOOL_DIR, 'apis.json'), 'utf8'));
  return cached;
}

export function platformNames() {
  return Object.keys(loadConfig().platforms);
}

/** Resolves an API name (and optional platform) to its endpoint and settings. */
export function resolveApi(apiName, platform) {
  const config = loadConfig();
  if (!apiName) throw new UsageError('Missing API name. Known APIs: ' + Object.keys(config.apis).join(', '));
  const api = config.apis[apiName];
  if (!api) throw new UsageError(`Unknown API "${apiName}". Known APIs: ${Object.keys(config.apis).join(', ')}`);
  const platformName = platform ?? config.defaults.platform;
  const plat = config.platforms[platformName];
  if (!plat) throw new UsageError(`Unknown platform "${platformName}". Known platforms: ${platformNames().join(', ')}`);
  return {
    apiName,
    name: api.name,
    platform: platformName,
    platformLabel: plat.label,
    url: (api.platforms?.[platformName] ?? plat.host + api.path),
    keyEnv: plat.keyEnv,
    requestsPerSecond: api.requestsPerSecond ?? config.defaults.requestsPerSecond,
    timeoutMs: config.defaults.timeoutMs,
    maxRetries: config.defaults.maxRetries,
  };
}

/** Commercial is the canonical schema (`<api>.graphql`); other platforms get a suffix. */
export function schemaPath(apiName, platform = loadConfig().defaults.platform) {
  const suffix = platform === 'commercial' ? '' : `.${platform}`;
  return join(SCHEMAS_DIR, `${apiName}${suffix}.graphql`);
}

export function accessPath(apiName) {
  return join(SCHEMAS_DIR, `${apiName}.access.json`);
}
