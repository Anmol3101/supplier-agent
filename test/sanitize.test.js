const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  sanitizeInput,
  sanitizeForEmail,
  sanitizeCell,
  validateSupplier
} = require('../lib/sanitize');

describe('sanitize', () => {
  it('sanitizeInput strips odd chars and caps length', () => {
    assert.equal(sanitizeInput('  hello<>world  ').startsWith('hello'), true);
  });

  it('sanitizeForEmail removes newlines', () => {
    assert.equal(sanitizeForEmail('sub\r\nject'), 'subject');
  });

  it('sanitizeCell prefixes formula-like strings', () => {
    assert.equal(sanitizeCell('=1+1'), "'=1+1");
  });

  it('validateSupplier normalizes shape', () => {
    const v = validateSupplier({ name: 'Co', score: '9' });
    assert.equal(v.score, 9);
    assert.equal(v.email, 'N/A');
  });
});
