import appConfig from "./config/appConfig";
import app from "./app";
import logger from "./config/loggerConfig";

const startServer = () => {
  try {
    const port = appConfig.port;
    app.listen(port, () => {
      logger.info(`Server running on port http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Error while starting server:", { error });
  }
};

startServer();
