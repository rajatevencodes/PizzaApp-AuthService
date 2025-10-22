import express from "express";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import prisma from "../db";
import logger from "../config/loggerConfig";
import { isValidEmail, isValidPassword, validateRequiredFields } from "../utils";
import { Roles } from "../constants";
import bcrypt from "bcrypt";

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

      logger.info(`Register attempt for email: ${email}`);

      // 2.0 - Validate required fields
      const requiredFieldsError = validateRequiredFields(req.body, [
        "name",
        "email",
        "password",
      ]);
    
      if (requiredFieldsError) {
        throw createHttpError(400, requiredFieldsError);
      }

      // 2.1 - Validate email format
      if(!isValidEmail(email)){
        throw createHttpError(400, "Please provide a valid email address");
      }

      // 2.2 - Validate password strength
      const passwordError = isValidPassword(password);
      if (passwordError) {
        throw createHttpError(400, passwordError);
      }

      // 3
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw createHttpError(409, "User with this email already exists");
      }

      // 4
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 5
      const newUser = await prisma.user.create({
        // Store this `data` in the database
        data: {
          name,
          email,
          password: hashedPassword,
          role: Roles.CUSTOMER, 
        },
        // `select` object is returned to the `newUser` variable
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      logger.info(`New user registered: ${newUser.email}`);

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
