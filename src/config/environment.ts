import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://bocahrkr:gEAGFOLCGtS5WffA@productzilla.2a2mu.mongodb.net/bookstore";
const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key";

export const config = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  port: process.env.PORT || 3000,
  mongoUri: MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: JWT_SECRET,
};

// Type definition untuk environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL?: string;
      PORT?: string;
      MONGO_URI?: string;
      NODE_ENV?: "development" | "production" | "test";
      JWT_SECRET?: string;
    }
  }
}

// Log environment configuration (for debugging)
console.log("Environment Configuration:", {
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: MONGO_URI,
  JWT_SECRET: JWT_SECRET ? "[SET]" : "[NOT SET]",
});

export default config;
