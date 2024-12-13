import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app, configureApp } from '../../src/app';
import mongo from '../../src/config/mongo';
import redis from '../../src/config/redis';
import Event from '../../src/models/Event';
import User from '../../src/models/User';

let sessionCookie: string[];

beforeAll(async () => {
  await configureApp(true);
  await mongo.getConnection().dropDatabase();
  await redis.getClient().flushDb();
  await Event.init();

  await new User({
    username: 'eventFetchTestUser',
    passwordHash: bcrypt.hashSync('password123', 8),
  }).save();

  const signInResponse = await request(app)
    .post('/auth/sign-in')
    .send({ username: 'eventFetchTestUser', password: 'password123' });

  const rawCookie = signInResponse.headers['set-cookie'];
  sessionCookie = Array.isArray(rawCookie) ? rawCookie : [rawCookie];

  await Event.create({
    name: 'Test Concert',
    date: new Date('2024-12-31T20:00:00Z'),
    address: '123 Test Street',
    category: 'Concert',
    location: {
      type: 'Point',
      coordinates: [-118.2437, 34.0522],
    },
  });

  await Event.create({
    name: 'Test Yard Sale',
    date: new Date('2024-12-25T10:00:00Z'),
    address: '456 Sample Road',
    category: 'Yard Sale',
    location: {
      type: 'Point',
      coordinates: [-118.15, 34.05],
    },
  });
});

afterAll(async () => {
  await mongo.disconnect();
  await redis.disconnect();
});

describe('GET /events', () => {
  it('should fetch events within a radius', async () => {
    const response = await request(app)
      .get('/events')
      .query({
        lat: 34.05,
        lng: -118.25,
        radius: 10,
      })
      .set('Cookie', sessionCookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });

  it('should fetch events matching a specific category', async () => {
    const response = await request(app)
      .get('/events')
      .query({
        lat: 34.05,
        lng: -118.25,
        radius: 10,
        category: 'Concert',
      })
      .set('Cookie', sessionCookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe('Test Concert');
  });

  it('should return an empty array if no events match the query', async () => {
    const response = await request(app)
      .get('/events')
      .query({
        lat: 35.0,
        lng: -119.0,
        radius: 5,
      })
      .set('Cookie', sessionCookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(0);
  });

  it('should fail if required query parameters are missing', async () => {
    const response = await request(app)
      .get('/events')
      .query({
        lat: 34.05,
        lng: -118.25,
      })
      .set('Cookie', sessionCookie);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('"radius" is required');
  });
});
