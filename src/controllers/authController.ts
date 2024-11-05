import { Request, Response } from "express";
import authService from "../service/authService";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Register endpoint hit");
    console.log("Request body:", req.body);

    const response = await authService.register(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    if (
      (error as Error).message === "Username already exists" ||
      (error as Error).message === "Username and password are required"
    ) {
      res.status(400).json({ error: (error as Error).message });
    } else {
      res.status(500).json({ error: "Server error during registration" });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Login endpoint hit");
    console.log("Request body:", req.body);

    const response = await authService.login(req.body);
    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    if ((error as Error).message === "Invalid credentials") {
      res.status(401).json({ error: "Invalid credentials" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

export default { register, login };
