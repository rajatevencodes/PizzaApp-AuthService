import winston from "winston";
// import appConfig from "./appConfig";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: {
    serviceName: "auth-service",
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "info.log",
      level: "info",
      // silent: appConfig.NODE_ENV === "development",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
      // silent: appConfig.NODE_ENV === "development",
    }),
  ],
});

export default logger;
