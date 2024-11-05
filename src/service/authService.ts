import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUser, IAuthResponse } from "../types/user";
import { config } from "../config/environment";

export class AuthService {
  async register(
    userData: Pick<IUser, "username" | "password">
  ): Promise<IAuthResponse> {
    const { username, password } = userData;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const user = new User({ username, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    return { token };
  }

  async login(
    credentials: Pick<IUser, "username" | "password">
  ): Promise<IAuthResponse> {
    const { username, password } = credentials;

    // Tambahkan validasi input
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    return { token };
  }
}

export default new AuthService();
