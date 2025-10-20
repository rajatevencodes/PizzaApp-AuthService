import express from "express";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import prisma from "../db";

const authRouter = express.Router();

// * 'Register'
authRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    /*
    Logic Flow:
    1. Extract user details from the request body
    2. Validate required fields , email format and password strength
    3. Check if user already exists in database
    4. Hash the password
    5. Save user to database
    6. Generate JWT token
    7. Set cookie and return user details
    */

    try {
      // 1
      const { name, email, password } = req.body;

      // 2.0 - Validate required fields
      if (
        !name ||
        !email ||
        !password ||
        name.trim() === "" ||
        email.trim() === "" ||
        password.trim() === ""
      ) {
        throw createHttpError(400, "All fields are required");
      }

      // 2.1 - Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw createHttpError(400, "Please provide a valid email address");
      }

      // 2.2 - Validate password strength
      if (password.length < 6) {
        throw createHttpError(
          400,
          "Password must be at least 6 characters long",
        );
      }

      // 3
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw createHttpError(409, "User with this email already exists");
      }

      // 5
      const newUser = await prisma.user.create({
        // Store this `data` in the database
        data: {
          name,
          email,
          password, // TODO : Hash the password
          role: "user",
        },
        // `select` object is returned to the `newUser` variable
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      res.status(201).json({
        success: true,
        user: newUser,
        message: "User registered successfully",
      });
    } catch (error: unknown) {
      // Passing error to global error handler
      next(error);
    }
  },
);

export default authRouter;
