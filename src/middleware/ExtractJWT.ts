import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import Logging from "../library/Logging";

const ExtractJWT = (req: Request, res: Response, next: NextFunction) => {
  Logging.info("Validating token");

  let token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, config.server.token.secret, (error, decoded) => {
      if (error) {
        return res.status(404).json({ error });
      } else {
        res.locals.jwt = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default ExtractJWT;
