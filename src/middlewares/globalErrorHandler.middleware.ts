import { HttpError } from "http-errors";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import logger from "../config/loggerConfig";
import appConfig from "../config/appConfig";

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const errorId = uuidv4();

  const statusCode = err.status || 500;
  const isProduction = appConfig.NODE_ENV === "production";
  console.log(appConfig.NODE_ENV);
  const message = isProduction ? `An unexpected error occurred.` : err.message;

  logger.error(err.message, {
    id: errorId,
    error: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    errors: [
      {
        ref: errorId,
        type: err.name,
        msg: message,
        path: req.path,
        location: "server",
        stack: isProduction ? null : err.stack,
      },
    ],
  });
};
