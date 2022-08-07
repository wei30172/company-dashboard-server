import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@company-dashboard.o7s1q4w.mongodb.net/`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8080;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "superIssuer";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "superencryptedSecret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "superencryptedSecret";

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
    token: {
      issuer: SERVER_TOKEN_ISSUER,
      accessSecret: ACCESS_TOKEN_SECRET,
      refreshSecret: REFRESH_TOKEN_SECRET,
    },
  },
};
