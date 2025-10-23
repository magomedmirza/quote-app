import express from "express";
import cors from "cors";
import helmet from "helmet";
import authMiddleware from "./middleware/authMiddleware.js";

//Route
import authRoute from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import kategoriRoute from "./routes/kategoriRoute.js";
import quoteRouter from "./routes/quoteRoute.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development
      "http://192.168.21.152:5173", // Your mobile access IP
      "http://localhost:5000", // Backend itself
      "http://192.168.21.152:5000", // Your mobile access IP
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());

app.use("/api/auth", authRoute);
app.use("/api/user", authMiddleware, userRouter);
app.use("/api/kategori", authMiddleware, kategoriRoute);
app.use("/api/quote", quoteRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Started Express http://localhost:${PORT}`);
});
