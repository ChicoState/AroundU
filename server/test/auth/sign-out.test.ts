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
    username: 'signOutTestExistingUser',
    passwordHash: bcrypt.hashSync('password123', 8),
  }).save();
});

afterAll(async () => {
  await mongo.disconnect();
  await redis.disconnect();
});

describe('POST /auth/sign-out', () => {
  it('signs out an active user and destroys the session', async () => {
    const signInResponse = await request(app)
      .post('/auth/sign-in')
      .send({ username: 'signOutTestExistingUser', password: 'password123' });
    expect(signInResponse.status).toBe(201);
    expect(signInResponse.body.success).toBe(true);

    const signOutResponse = await request(app)
      .post('/auth/sign-out')
      .set('Cookie', signInResponse.headers['set-cookie']);
    expect(signOutResponse.status).toBe(200);
    expect(signOutResponse.body.success).toBe(true);

    const sessionCheck = await request(app)
      .get('/auth')
      .set('Cookie', signInResponse.headers['set-cookie']);
    expect(sessionCheck.status).toBe(200);
    expect(sessionCheck.body.data).toBe(false);
  });

  it('fails to sign out without an active session', async () => {
    const response = await request(app).post('/auth/sign-out');
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Forbidden: Unauthorized access.');
  });
});
