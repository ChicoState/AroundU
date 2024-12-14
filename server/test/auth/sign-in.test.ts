import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app, configureApp } from '../../src/app';
import mongo from '../../src/config/mongo';
import redis from '../../src/config/redis';
import User from '../../src/models/User';

beforeAll(async () => {
  await configureApp(true);
  await mongo.getConnection().dropDatabase();
  await redis.getClient().flushDb();
  await new User({
    username: 'signInTestExistingUser',
    passwordHash: bcrypt.hashSync('password123', 8),
  }).save();
});

afterAll(async () => {
  await mongo.disconnect();
  await redis.disconnect();
});

describe('POST /auth/sign-in', () => {
  it('signs in an existing user and starts a session', async () => {
    const response = await request(app)
      .post('/auth/sign-in')
      .send({ username: 'signInTestExistingUser', password: 'password123' });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    const sessionCheck = await request(app)
      .get('/auth')
      .set('Cookie', response.headers['set-cookie']);
    expect(sessionCheck.status).toBe(200);
    expect(sessionCheck.body.data).toBe(true);
  });

  it('fails if username does not exist', async () => {
    const response = await request(app)
      .post('/auth/sign-in')
      .send({ username: 'signInTestNonexistentUser', password: 'password123' });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User not found');
  });

  it('fails if password is incorrect', async () => {
    const response = await request(app)
      .post('/auth/sign-in')
      .send({ username: 'signInTestExistingUser', password: 'wrongpassword' });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid password');
  });

  it('fails if username is missing', async () => {
    const response = await request(app)
      .post('/auth/sign-in')
      .send({ password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('"username" is required');
  });

  it('fails if password is missing', async () => {
    const response = await request(app)
      .post('/auth/sign-in')
      .send({ username: 'signInTestExistingUser' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('"password" is required');
  });
});
