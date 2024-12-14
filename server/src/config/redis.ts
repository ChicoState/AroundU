import { createClient, RedisClientType } from 'redis';

const redisUrl = 'redis://aroundu-redis:6379';

let redisClient: RedisClientType | null = null;
let isConnected = false;

const connect = async (fromLocal?: boolean): Promise<RedisClientType> => {
  try {
    if (!isConnected) {
      redisClient = createClient({
        url: fromLocal ? 'redis://localhost:6379' : redisUrl,
      });
      await redisClient.connect();
      isConnected = true;
    }
    return redisClient!;
  } catch (error) {
    console.error('> Redis connection failed', (error as Error).message);
    throw error;
  }
};

const disconnect = async (): Promise<void> => {
  try {
    if (isConnected && redisClient) {
      await redisClient.quit();
      isConnected = false;
    }
  } catch (error) {
    console.error('> Redis disconnection failed', (error as Error).message);
    throw error;
  }
};

const getClient = (): RedisClientType => {
  if (!isConnected || !redisClient) {
    throw new Error('Redis is not connected. Call connect() first.');
  }
  return redisClient;
};

export default {
  connect,
  disconnect,
  getClient,
};
