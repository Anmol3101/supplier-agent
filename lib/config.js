const fs = require('fs');
const path = require('path');

let cached;

function validateAgentConfig(raw) {
  const fail = (msg) => {
    throw new Error(`agent.config.json: ${msg}`);
  };

  if (!raw || typeof raw !== 'object') fail('root must be an object');

  const g = raw.groq;
  if (!g || typeof g !== 'object') fail('groq section required');
  if (typeof g.model !== 'string' || !g.model.trim()) fail('groq.model must be a non-empty string');
  for (const k of ['maxTokensBatch', 'maxTokensOutreach']) {
    if (typeof g[k] !== 'number' || g[k] < 1 || !Number.isInteger(g[k])) {
      fail(`groq.${k} must be a positive integer`);
    }
  }

  const r = raw.research;
  if (!r || typeof r !== 'object') fail('research section required');
  for (const k of ['batchSize', 'totalBatches', 'cooldownSeconds', 'rateLimitBackoffSeconds']) {
    if (typeof r[k] !== 'number' || r[k] < 1 || !Number.isInteger(r[k])) {
      fail(`research.${k} must be a positive integer`);
    }
  }

  const e = raw.email;
  if (!e || typeof e !== 'object') fail('email section required');
  for (const k of ['outreachDelayMs', 'topReport', 'defaultMaxOutreach']) {
    if (typeof e[k] !== 'number' || e[k] < 0 || !Number.isInteger(e[k])) {
      fail(`email.${k} must be a non-negative integer`);
    }
  }

  const v = raw.verification;
  if (!v || typeof v !== 'object') fail('verification section required');
  if (typeof v.dnsChunk !== 'number' || v.dnsChunk < 1 || !Number.isInteger(v.dnsChunk)) {
    fail('verification.dnsChunk must be a positive integer');
  }

  const d = raw.defaults;
  if (!d || typeof d !== 'object') fail('defaults section required');
  if (typeof d.productQuery !== 'string') fail('defaults.productQuery must be a string');

  const b = raw.brand;
  if (!b || typeof b !== 'object') fail('brand section required');
  for (const k of ['reportFromName', 'companyName', 'roleTitle']) {
    if (typeof b[k] !== 'string' || !b[k].trim()) fail(`brand.${k} must be a non-empty string`);
  }
}

function loadRaw() {
  const configPath = path.join(__dirname, '..', 'agent.config.json');
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  validateAgentConfig(raw);
  return raw;
}

function getConfig() {
  if (!cached) {
    const raw = loadRaw();
    cached = {
      MODEL: raw.groq.model,
      MAX_TOKENS_BATCH: raw.groq.maxTokensBatch,
      MAX_TOKENS_OUTREACH: raw.groq.maxTokensOutreach,
      BATCH_SIZE: raw.research.batchSize,
      TOTAL_BATCHES: raw.research.totalBatches,
      COOLDOWN_MS: raw.research.cooldownSeconds * 1000,
      RATE_LIMIT_BACKOFF_MS: raw.research.rateLimitBackoffSeconds * 1000,
      OUTREACH_DELAY_MS: raw.email.outreachDelayMs,
      DNS_CHUNK: raw.verification.dnsChunk,
      TOP_REPORT: raw.email.topReport,
      DEFAULT_MAX_OUTREACH: raw.email.defaultMaxOutreach,
      DEFAULT_QUERY: raw.defaults.productQuery,
      BRAND: raw.brand
    };
  }
  return cached;
}

function resetConfigCache() {
  cached = undefined;
}

module.exports = { getConfig, resetConfigCache, validateAgentConfig };
