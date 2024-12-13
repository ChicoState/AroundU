import { app, configureApp } from './app';

const startServer = async () => {
  try {
    await configureApp();
    app.listen(3001, () => {
      console.log('> Server running on http://localhost:3001');
    });
  } catch (error) {
    console.error('> Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
