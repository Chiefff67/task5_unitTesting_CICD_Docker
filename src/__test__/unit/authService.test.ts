import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { AuthService } from "../../service/authService";
import User from "../../models/User";
import { IUser } from "../../types/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/environment";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("AuthService", () => {
  let authService: AuthService;

  const mockUser: Pick<IUser, "username" | "password"> = {
    username: "testuser",
    password: "testpassword123",
  };

  beforeEach(async () => {
    authService = new AuthService();
    // Clear all users before each test
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const result = await authService.register(mockUser);

      // Verify token is returned
      expect(result).toHaveProperty("token");
      expect(typeof result.token).toBe("string");

      // Verify user was created in database
      const user = await User.findOne({ username: mockUser.username });
      expect(user).toBeTruthy();
      expect(user?.username).toBe(mockUser.username);

      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare(
        mockUser.password,
        user!.password
      );
      expect(isPasswordValid).toBe(true);
    });

    it("should throw error if username is missing", async () => {
      const invalidUser = { password: "test123" };

      await expect(
        authService.register(
          invalidUser as Pick<IUser, "username" | "password">
        )
      ).rejects.toThrow("Username and password are required");
    });

    it("should throw error if password is missing", async () => {
      const invalidUser = { username: "testuser" };

      await expect(
        authService.register(
          invalidUser as Pick<IUser, "username" | "password">
        )
      ).rejects.toThrow("Username and password are required");
    });

    it("should throw error if username already exists", async () => {
      // First registration
      await authService.register(mockUser);

      // Attempt to register with same username
      await expect(authService.register(mockUser)).rejects.toThrow(
        "Username already exists"
      );
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      // Create a user before each login test
      await authService.register(mockUser);
    });

    it("should login successfully with correct credentials", async () => {
      const result = await authService.login(mockUser);

      expect(result).toHaveProperty("token");
      expect(typeof result.token).toBe("string");

      // Verify token content
      const decoded = jwt.verify(result.token, config.jwtSecret) as {
        userId: string;
      };
      expect(decoded).toHaveProperty("userId");
    });

    it("should throw error with incorrect password", async () => {
      const wrongCredentials = {
        username: mockUser.username,
        password: "wrongpassword",
      };

      await expect(authService.login(wrongCredentials)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should throw error with non-existent username", async () => {
      const nonExistentUser = {
        username: "nonexistent",
        password: "test123",
      };

      await expect(authService.login(nonExistentUser)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should throw error if username is missing", async () => {
      const invalidCredentials = { password: "test123" };

      await expect(
        authService.login(
          invalidCredentials as Pick<IUser, "username" | "password">
        )
      ).rejects.toThrow("Username and password are required");
    });

    it("should throw error if password is missing", async () => {
      const invalidCredentials = { username: "testuser" };

      await expect(
        authService.login(
          invalidCredentials as Pick<IUser, "username" | "password">
        )
      ).rejects.toThrow("Username and password are required");
    });
  });
});
