import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log("MONGO_URI:", process.env.MONGO_URI);
// console.log("JWT_SECRET:", process.env.JWT_SECRET);

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI not defined in .env file");
    }

    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME,
    } as ConnectOptions);

    console.log("Database connected successfully");
    // console.log("MONGO_URI:", process.env.MONGO_URI);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};



export default connectDB;
