const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { sortByScoreDesc, mailFrom } = require('../lib/utils');

describe('utils', () => {
  it('sortByScoreDesc orders by score', () => {
    const out = sortByScoreDesc([
      { score: 1, name: 'a' },
      { score: 5, name: 'b' },
      { score: 3, name: 'c' }
    ]);
    assert.deepEqual(out.map((s) => s.name), ['b', 'c', 'a']);
  });

  it('mailFrom uses EMAIL_USER', () => {
    process.env.EMAIL_USER = 'u@example.com';
    assert.equal(mailFrom('Pat'), 'Pat <u@example.com>');
  });
});
