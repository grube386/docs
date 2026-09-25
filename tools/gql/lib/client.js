import { getApiKey, redact } from './env.js';

const RETRYABLE_STATUS = new Set([429, 502, 503, 504]);
const BASE_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 32000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One throttle per process: every request, whatever the endpoint, waits for its slot.
let nextSlotAt = 0;
async function throttle(requestsPerSecond) {
  const interval = 1000 / requestsPerSecond;
  const now = Date.now();
  const wait = Math.max(0, nextSlotAt - now);
  nextSlotAt = Math.max(now, nextSlotAt) + interval;
  if (wait) await sleep(wait);
}

function retryAfterMs(header) {
  if (!header) return undefined;
  const secs = Number(header);
  if (Number.isFinite(secs)) return secs * 1000;
  const date = Date.parse(header);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
}

export function backoffMs(attempt, retryAfter) {
  const exp = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** attempt);
  return Math.max(exp, retryAfter ?? 0);
}

export class HttpError extends Error {
  constructor(status, body) {
    super(redact(`HTTP ${status}: ${String(body).slice(0, 300)}`));
    this.status = status;
  }
}

/**
 * POSTs one GraphQL operation. Returns the parsed body ({ data, errors }) as-is;
 * GraphQL errors are the caller's business. Throws on transport failure after retries.
 */
export async function request(endpoint, query, variables, { log = () => {}, operationName } = {}) {
  const apiKey = getApiKey(endpoint.keyEnv, endpoint.platformLabel);
  const payload = { query };
  if (variables) payload.variables = variables;
  if (operationName) payload.operationName = operationName;
  const body = JSON.stringify(payload);
  for (let attempt = 0; ; attempt++) {
    await throttle(endpoint.requestsPerSecond);
    let res;
    try {
      res = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json', 'x-api-key': apiKey },
        body,
        signal: AbortSignal.timeout(endpoint.timeoutMs),
      });
    } catch (err) {
      if (attempt >= endpoint.maxRetries) throw new Error(redact(`Request to ${endpoint.url} failed: ${err.message}`));
      const wait = backoffMs(attempt);
      log(`network error (${redact(err.message)}), retrying in ${wait} ms`);
      await sleep(wait);
      continue;
    }
    const text = await res.text();
    if (RETRYABLE_STATUS.has(res.status) && attempt < endpoint.maxRetries) {
      const wait = backoffMs(attempt, retryAfterMs(res.headers.get('retry-after')));
      log(`HTTP ${res.status}, retrying in ${wait} ms (attempt ${attempt + 1}/${endpoint.maxRetries})`);
      await sleep(wait);
      continue;
    }
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new HttpError(res.status, text);
    }
    // GraphQL servers may answer 4xx with a JSON error body; hand it back so the message is visible.
    if (!res.ok && !json.errors) throw new HttpError(res.status, text);
    return json;
  }
}
