import express from "express";
import dotenv  from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";
import timelineRouter from "./routes/timelineRoutes.js";
import { errorMiddleware } from './middleware/error.js';
import applicationRouter from "./routes/softwareApplicationRoutes.js"
import skillRouter from "./routes/skillRoute.js";
import projectRouter from "./routes/projectRoutes.js"

dotenv.config()

const app = express();


// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Middleware to parse URL-encoded data (form submissions)
app.use(express.urlencoded({extended: true}));

// ✅ Middleware for cookies (if JWT is stored in cookies)
app.use(cookieParser());

// ✅ Middleware for file uploads (if you're using req.files)
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));
// ✅ (Optional) Debug middleware to confirm route hit
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// middleware to resolve the cross origin url issue
const allowedOrigins = [
  process.env.PORTFOLIO_URL,
  process.env.DASHBOARD_URL 
];

app.use(cors({
  origin: function(origin, callback) {
    console.log("Incoming request origin:", origin); // debug

    if (!origin) return callback(null, true); // allow Postman, server requests

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      return callback(null, false); // fail silently instead of throwing error
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/softwareapplication", applicationRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/project", projectRouter);
// ✅ Global error handler LAST
// app.use(errorHandler)
app.use(errorMiddleware);

export default app;