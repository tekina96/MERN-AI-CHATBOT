import express from "express";
import { config } from "dotenv";
import morgan from 'morgan';
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
config();
const app = express();

// const corsOption = {
//     origin: ['http://localhost:5173'],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
// }
// Middlewares
// app.use(cors(corsOption));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// we only use it during developement mode and remove it in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;