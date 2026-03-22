const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseCli } = require('../lib/cli');

const flat = {
  DEFAULT_MAX_OUTREACH: 10,
  DEFAULT_QUERY: 'x'
};

describe('cli', () => {
  it('parses query and max outreach', () => {
    const r = parseCli(['node', 'index.js', 'motors', '--max-outreach=3'], flat);
    assert.equal(r.query, 'motors');
    assert.equal(r.maxOutreach, 3);
    assert.equal(r.dryRun, false);
  });

  it('enables dry-run', () => {
    const r = parseCli(['node', 'index.js', '--dry-run', 'q'], flat);
    assert.equal(r.dryRun, true);
    assert.equal(r.query, 'q');
  });
});
