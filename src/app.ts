import express from "express";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware";
import authRoutes from "./routes/authRoutes";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/handle-error", (req: Request, res: Response, next: NextFunction) => {
  const error = createHttpError(500, "Simulated server error");
  // ! Make sure to use next to pass the error to the global error handler
  // * Do not use throw error; as it won't be caught by the middleware and crashes the server
  next(error);
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Okay!");
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
