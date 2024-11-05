import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  port: process.env.PORT || 3000,
  mongoUri:
    process.env.MONGO_URI ||
    "mongodb+srv://bocahrkr:gEAGFOLCGtS5WffA@productzilla.2a2mu.mongodb.net/bookstore",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
};

// Type definition untuk environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL?: string;
      PORT?: string;
      MONGO_URI: string;
      NODE_ENV?: "development" | "production" | "test";
      JWT_SECRET: string;
    }
  }
}

// Validasi environment variables yang diperlukan
const requiredEnvVars: (keyof NodeJS.ProcessEnv)[] = [
  "MONGO_URI",
  "JWT_SECRET",
];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

export default config;
