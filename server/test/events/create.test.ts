import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app, configureApp } from '../../src/app';
import mongo from '../../src/config/mongo';
import redis from '../../src/config/redis';
import User from '../../src/models/User';
import Event from '../../src/models/Event';

let sessionCookie: string[];

beforeAll(async () => {
  await configureApp(true);
  await mongo.getConnection().dropDatabase();
  await redis.getClient().flushDb();
  await Event.init();

  await new User({
    username: 'eventCreateTestUser',
    passwordHash: bcrypt.hashSync('password123', 8),
  }).save();

  const signInResponse = await request(app)
    .post('/auth/sign-in')
    .send({ username: 'eventCreateTestUser', password: 'password123' });

  const rawCookie = signInResponse.headers['set-cookie'];
  sessionCookie = Array.isArray(rawCookie) ? rawCookie : [rawCookie];
});

afterAll(async () => {
  await mongo.disconnect();
  await redis.disconnect();
});

describe('POST /events', () => {
  it('should create a new event successfully', async () => {
    const response = await request(app)
      .post('/events')
      .set('Cookie', sessionCookie)
      .send({
        name: 'Test Event',
        date: '2024-12-12T18:00:00.000Z',
        address: '1600 Amphitheatre Parkway, Mountain View, CA',
        description: 'This is a test event.',
        category: 'Concert',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Event');
    expect(response.body.data.address).toBe(
      '1600 Amphitheatre Parkway, Mountain View, CA',
    );
    expect(response.body.data.category).toBe('Concert');

    const event = await Event.findOne({ name: 'Test Event' });
    expect(event).toBeTruthy();
    expect(event?.name).toBe('Test Event');
    expect(event?.address).toBe('1600 Amphitheatre Parkway, Mountain View, CA');
    expect(event?.category).toBe('Concert');
  });

  it('should fail to create an event with invalid data', async () => {
    const response = await request(app)
      .post('/events')
      .set('Cookie', sessionCookie)
      .send({
        name: '',
        date: 'invalid-date',
        address: '',
        category: 'InvalidCategory',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain(
      '"name" is not allowed to be empty',
    );
  });

  it('should fail to create an event without authentication', async () => {
    const response = await request(app).post('/events').send({
      name: 'Unauthorized Event',
      date: '2024-12-12T18:00:00.000Z',
      address: '123 Fake Street',
      category: 'Concert',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Forbidden: Unauthorized access.');
  });
});
