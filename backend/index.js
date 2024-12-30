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
        origin: process.env.URL || "http://localhost:5173", // Frontend URL
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    },
});

// Initialize Socket.IO
initializeSocketIO(io);

// 🛡️ Middleware Setup
app.use(express.json());
app.use(cookieParser());

// 🌐 CORS Configuration
const corsOptions = {
    origin: process.env.URL || "http://localhost:5174",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
};
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// 📝 Logging Middleware (for debugging)
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

// 📦 API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/story", storyRoute);
app.use("/api/v1/notification", notificationRoute);
//📂 Serve Public Folder

// ⚙️ Serve Frontend (Static Files)
// Serve the public folder
// Serve Frontend Build (dist)
app.use(express.static(path.join(__dirname, '/frontend/dist')));

// Serve Public Folder (images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));



// ⚠️ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({ message: err.message });
});

// 🚀 Start Server and Connect to Database
server.listen(PORT, () => {
    connectDB();
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

export { io };
