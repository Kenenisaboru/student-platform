const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

before(() => {
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student-platform-test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-minimum-32-characters-long';
  process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5180';
});

describe('GET /api/health', () => {
  it('returns status payload', async () => {
    const app = require('../app');
    const res = await request(app).get('/api/health');
    assert.ok([200, 503].includes(res.status));
    assert.ok(res.body.status);
    assert.ok(res.body.timestamp);
    assert.ok(res.body.database);
  });
});
