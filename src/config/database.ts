import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI as string;
    if (!uri) {
      throw new Error("MONGO_URI not defined in .env file");
    }

    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME,
    } as ConnectOptions);

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
