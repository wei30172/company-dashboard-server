import express from "express";
import http from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { config } from "./config/config";
import Logging from "./library/Logging";
import Credentials from "./middleware/Credentials";
import { authRoutes, userRoutes, taskRoutes, productRoutes, orderRoutes } from "./routes";
import VerifyJWT from "./middleware/VerifyJWT";

const router = express();

/** Contect to Mongo. */
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    Logging.info("Connected to mongoDB.");
    StartServer();
  })
  .catch((error) => {
    Logging.error("Unable to connect.");
    Logging.error(error);
  });

/** Only start the server if Mongo contects. */
const StartServer = () => {
  router.use((req, res, next) => {
    /** Log the Request */
    Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on("finish", () => {
      Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: ${res.statusCode}`);
    });

    next();
  });

  // Handle options credentials check - before CORS!
  // add cookies credentials requirement
  router.use(Credentials);

  // built-in middleware to handle urlencoded form data
  router.use(express.urlencoded({ extended: true }));

  // built-in middleware for json
  router.use(express.json());

  // middleware for cookies
  router.use(cookieParser());

  /** Rules of API */
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Origin", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json();
    }

    next();
  });

  /** Routes */
  router.use("/auth", authRoutes);
  router.use(VerifyJWT);
  router.use("/users", userRoutes);
  router.use("/tasks", taskRoutes);
  router.use("/products", productRoutes);
  router.use("/orders", orderRoutes);

  /** Healthcheck */
  router.get("/ping", (req, res, next) => res.status(200).json({ message: "pong" }));

  /** Error handling */
  router.use((req, res, next) => {
    const error = new Error("not found");
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });

  http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}.`));
};
