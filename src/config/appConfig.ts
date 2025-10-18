import { config } from "dotenv";
import path from "path";

config({path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`)});

// Load env variables based on the NODE_ENV - .env.testing , .env.development, .env.production
const appConfig = {
  port: process.env.PORT || 5501,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default appConfig;
