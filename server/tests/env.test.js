const { describe, it } = require('node:test');
const assert = require('node:assert');
const { getAllowedOrigins } = require('../config/env');

describe('getAllowedOrigins', () => {
  it('includes CLIENT_URL and dev origins in development', () => {
    const prev = { ...process.env };
    process.env.NODE_ENV = 'development';
    process.env.CLIENT_URL = 'https://app.example.com';

    const origins = getAllowedOrigins();
    assert.ok(origins.includes('https://app.example.com'));
    assert.ok(origins.includes('http://localhost:5173'));

    process.env = prev;
  });
});
