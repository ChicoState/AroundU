import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app, configureApp } from '../../src/app';
import mongo from '../../src/config/mongo';
import redis from '../../src/config/redis';
import User from '../../src/models/User';

beforeAll(async () => {
  await configureApp(true);
  await mongo.getConnection().dropDatabase();
  await redis.getClient().flushDb();
  await User.init();
});

afterAll(async () => {
  await mongo.disconnect();
  await redis.disconnect();
});

describe('POST /auth/sign-up', () => {
  it('creates a new user and starts a session', async () => {
    const response = await request(app)
      .post('/auth/sign-up')
      .send({ username: 'signUpTestUser', password: 'password123' });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.username).toBe('signUpTestUser');

    const user = await User.findOne({ username: 'signUpTestUser' });
    expect(user).toBeTruthy();
    expect(user?.username).toBe('signUpTestUser');

    const sessionCheck = await request(app)
      .get('/auth')
      .set('Cookie', response.headers['set-cookie']);
    expect(sessionCheck.status).toBe(200);
    expect(sessionCheck.body.data).toBe(true);
  });

  it('fails if username already exists', async () => {
    await request(app)
      .post('/auth/sign-up')
      .send({ username: 'signUpTestDuplicateUser', password: 'password123' });

    const response = await request(app)
      .post('/auth/sign-up')
      .send({ username: 'signUpTestDuplicateUser', password: 'password123' });
    expect(response.status).not.toBe(201);
    expect(response.body.success).toBe(false);
  });

  it('fails if username is missing', async () => {
    const response = await request(app)
      .post('/auth/sign-up')
      .send({ password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('"username" is required');
  });

  it('fails if password is missing', async () => {
    const response = await request(app)
      .post('/auth/sign-up')
      .send({ username: 'signUpTestUser' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('"password" is required');
  });

  it('fails for invalid username format', async () => {
    const response = await request(app)
      .post('/auth/sign-up')
      .send({ username: '', password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('"username" is not allowed to be empty');
  });

  it('fails for invalid password format', async () => {
    const response = await request(app)
      .post('/auth/sign-up')
      .send({ username: 'signUpTestUser', password: '' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('"password" is not allowed to be empty');
  });
});
