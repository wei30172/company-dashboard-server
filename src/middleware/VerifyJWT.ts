import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import Logging from "../library/Logging";

const VerifyJWT = (req: Request, res: Response, next: NextFunction) => {
  Logging.info("Validating token");

  let token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, config.server.token.accessSecret, (error, decoded) => {
      if (error) {
        return res.status(403).json({ error }); //invalid token
      } else {
        res.locals.jwt = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default VerifyJWT;
