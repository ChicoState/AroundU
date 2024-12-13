import mongoose from 'mongoose';

const mongoUrl =
  process.env.MONGO_URI || 'mongodb://aroundu-mongo:27017/aroundu_db';

let isConnected = false;

const connect = async () => {
  try {
    if (!isConnected) {
      await mongoose.connect(mongoUrl);
      isConnected = true;
      console.log('> Connected to MongoDB using Mongoose');
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
    console.log('> MongoDB connection closed');
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
