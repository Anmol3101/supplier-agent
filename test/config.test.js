const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateAgentConfig } = require('../lib/config');

const valid = {
  groq: { model: 'm', maxTokensBatch: 100, maxTokensOutreach: 50 },
  research: {
    batchSize: 10,
    totalBatches: 2,
    cooldownSeconds: 1,
    rateLimitBackoffSeconds: 2
  },
  email: { outreachDelayMs: 100, topReport: 5, defaultMaxOutreach: 3 },
  verification: { dnsChunk: 20 },
  defaults: { productQuery: 'p' },
  brand: { reportFromName: 'A', companyName: 'B', roleTitle: 'C' }
};

describe('config validation', () => {
  it('accepts valid config', () => {
    assert.doesNotThrow(() => validateAgentConfig(valid));
  });

  it('rejects bad groq', () => {
    assert.throws(() => validateAgentConfig({ ...valid, groq: {} }));
  });
});
