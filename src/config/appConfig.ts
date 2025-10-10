import { config } from "dotenv";
config(); // Load .env variables

const appConfig = {
  port: process.env.PORT || 5501,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default appConfig;
