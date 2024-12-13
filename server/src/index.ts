import express from 'express';
import mongo from '@/config/mongo';
import routes from '@/routes/routes';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import './types/session';
import errorHandler from './middleware/error';

dotenv.config();

const app = express();

const corsOptions = {
  origin: [`http://localhost:3000`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

const startServer = async () => {
  try {
    await mongo.connect();

    const redis = createClient({
      url: `redis://aroundu-redis:6379`,
    });
    await redis.connect();
    await redis.flushDb();
    const store = new RedisStore({
      client: redis,
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

    app.listen(3001, () => {
      console.log('> Server running on http://localhost:3001');
    });
  } catch (error) {
    console.error(
      '> Failed to start the server due to MongoDB connection error:',
      error,
    );
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('> Received SIGINT, closing MongoDB connection...');
  await mongo.disconnect();
  process.exit(0);
});

startServer();
