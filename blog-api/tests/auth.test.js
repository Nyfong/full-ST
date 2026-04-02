const request = require('supertest');

const app = require('../app');
const resetData = require('./helpers/reset-data');

describe('Auth API', function () {
  beforeEach(function () {
    resetData();
  });

  test('registers and returns token', async function () {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'secret123'
      });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('jane@example.com');
    expect(response.body.token).toBeTruthy();
  });

  test('logs in and returns token', async function () {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'secret123'
      });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'jane@example.com', password: 'secret123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });
});

