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
    2. Validate required fields and email format
    3. Check if user already exists in database
    4. Hash the password
    5. Save user to database
    6. Generate JWT token
    7. Set cookie and return user details
    */

    try {
      // 1
      const { name, email, password } = req.body;

      // 2s
      if ([name, email, password].some((field) => field?.trim() === "")) {
        throw createHttpError(400, "All fields are required");
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
        // Returns this `select` object to the newUser variable
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
