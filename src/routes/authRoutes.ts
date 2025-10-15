import express from "express";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

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
      const { name, email, password } = req.body;

      // Validate required fields
      if ([name, email, password].some((field) => field?.trim() === "")) {
        throw createHttpError(400, "All fields are required");
      }

      // TODO: Add email format validation
      // TODO: Check if user already exists
      // TODO: Hash password
      // TODO: Save to database
      // TODO: Generate JWT token
      // TODO: Set cookie

      // For now, return success
      res.status(201).json({
        success: true,
        data: {
          user: { name, email },
        },
        message: "User registered successfully",
      });
    } catch (error: unknown) {
      // Passing error to global error handler
      next(error);
    }
  },
);

export default authRouter;
