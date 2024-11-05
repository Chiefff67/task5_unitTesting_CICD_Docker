import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

jest.setTimeout(30000);

const closeConnection = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

beforeAll(async () => {
  await closeConnection();

  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Memory Server");
  } catch (error) {
    console.error("MongoDB setup failed:", error);
    throw error;
  }
});

afterAll(async () => {
  await closeConnection();
  console.log("Disconnected from MongoDB Memory Server");
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});
