const request = require('supertest');

const app = require('../app');
const resetData = require('./helpers/reset-data');

async function createUserAndToken() {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'Post User',
      email: 'post-user@example.com',
      password: 'secret123'
    });

  return {
    token: response.body.token,
    user: response.body.user
  };
}

describe('Posts API', function () {
  beforeEach(function () {
    resetData();
  });

  test('creates and fetches a post', async function () {
    const auth = await createUserAndToken();

    const createResponse = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', 'Bearer ' + auth.token)
      .send({
        title: 'Hello MVC',
        content: 'This is my first post in the API service.'
      });

    expect(createResponse.status).toBe(201);

    const postId = createResponse.body.post.id;

    const getResponse = await request(app).get('/api/v1/posts/' + postId);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.post.title).toBe('Hello MVC');
  });

  test('rejects creating a post without token', async function () {
    const response = await request(app)
      .post('/api/v1/posts')
      .send({
        title: 'No Auth',
        content: 'This request should be rejected by auth middleware.'
      });

    expect(response.status).toBe(401);
  });
});

