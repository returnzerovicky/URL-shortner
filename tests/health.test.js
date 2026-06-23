const request = require('supertest');
const app = require('../src/server');

describe('Health endpoint', () => {
  test('GET / should return 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
