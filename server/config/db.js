const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
      console.log('No MONGODB_URI environment variable found.');
      console.log('Starting local in-memory MongoDB Server (mongodb-memory-server)...');
      mongoServer = await MongoMemoryServer.create();
      dbUri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at: ${dbUri}`);
    }

    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      console.log('In-memory MongoDB Server stopped.');
    }
  } catch (error) {
    console.error(`Error disconnecting database: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
