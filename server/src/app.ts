import express from 'express';
import mongo from '@/config/mongo';
import redis from '@/config/redis';
import routes from '@/routes/routes';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import './types/session';
import errorHandler from './middleware/error';

dotenv.config();

const app = express();

const configureApp = async (fromLocal?: boolean) => {
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    }),
  );

  app.use(express.json());

  await mongo.connect(fromLocal);
  const redisClient = await redis.connect(fromLocal);

  const store = new RedisStore({
    client: redisClient,
    disableTouch: true,
  });

  app.use(
    session({
      store,
      secret: 'aroundu',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000,
        sameSite: 'strict',
      },
    }),
  );

  app.use(routes);
  app.use(errorHandler);
};

export { app, configureApp };
