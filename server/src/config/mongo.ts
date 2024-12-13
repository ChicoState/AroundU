import mongoose from 'mongoose';

const mongoUrl =
  process.env.MONGO_URI || 'mongodb://aroundu-mongo:27017/aroundu_db';

let isConnected = false;

const connect = async (fromLocal?: boolean) => {
  try {
    if (!isConnected) {
      await mongoose.connect(
        fromLocal ? 'mongodb://localhost:27017/aroundu_db' : mongoUrl,
      );
      isConnected = true;
    }
  } catch (error) {
    console.error('> MongoDB connection failed', (error as Error).message);
    throw error;
  }
};

const disconnect = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
};

const getConnection = () => {
  if (!isConnected) {
    throw new Error('Mongoose is not connected. Call connect() first.');
  }
  return mongoose.connection;
};

export default {
  connect,
  disconnect,
  getConnection,
};
