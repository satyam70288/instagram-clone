import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import storyRoute from "./routes/story.route.js";
import notificationRoute from "./routes/notification.routes.js";
import messageRoute from "./routes/message.route.js";
import { initializeSocketIO } from "./socket/socket.js";

dotenv.config();

// Server Configurations
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const app = express();
const server = createServer(app);

// 📡 Socket.IO Configuration
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173", // ✅ ENV value or localhost
      "https://instagram-clone-git-main-satyam70288s-projects.vercel.app",
      "https://instagram-clone-nine-lake.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Initialize Socket.IO
initializeSocketIO(io);

// 🛡️ Middleware Setup
app.use(express.json());
app.use(cookieParser());

// 🌐 CORS Configuration for Express
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        process.env.FRONTEND_URL, // ✅ env se read karega
        "https://clone-insta-2.netlify.app",
        "https://instagram-clone-git-main-satyam70288s-projects.vercel.app",
        "https://instagram-clone-nine-lake.vercel.app",
      ];

      // Allow Vercel preview deploys: https://swag-fashion-*.vercel.app
      const isVercelPreview =
        origin && /^https:\/\/swag-fashion.*\.vercel\.app$/.test(origin);

      if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);

// 📝 Logging Middleware (for debugging)
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// 📦 API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/story", storyRoute);
app.use("/api/v1/notification", notificationRoute);

// ⚙️ Serve Frontend Build (dist)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Serve Public Folder (images, etc.)
app.use("/public", express.static(path.join(__dirname, "public")));

// ⚠️ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

// 🚀 Start Server and Connect to Database
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export { io };
