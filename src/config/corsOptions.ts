export const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:8080", "http://localhost:3000"];

export const corsOptions = {
  origin: (origin: string, callback: any) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
