const { describe, it } = require('node:test');
const assert = require('node:assert');

const strongPassword = 'Secure1!pass';
const weakPassword = 'short';

describe('password policy', () => {
  const rules = [
    (p) => p.length >= 8,
    (p) => /[A-Z]/.test(p),
    (p) => /[a-z]/.test(p),
    (p) => /\d/.test(p),
    (p) => /[!@#$%^&*]/.test(p),
  ];

  it('accepts strong passwords', () => {
    assert.ok(rules.every((r) => r(strongPassword)));
  });

  it('rejects weak passwords', () => {
    assert.ok(rules.some((r) => !r(weakPassword)));
  });
});
