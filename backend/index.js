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
import storyRoute from './routes/story.route.js';
import notificationRoute from "./routes/notification.routes.js";
import messageRoute from "./routes/message.route.js";
import { initializeSocketIO } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const app = express();
const server = createServer(app);

// Socket.IO configuration
const io = new Server(server, {
    cors: {
        origin: process.env.URL || "http://localhost:5173", // Ensure this is set to your frontend's URL
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Include PATCH method
        credentials: true, // Allow credentials to be sent with Socket.IO
    },
});

// Initialize Socket.IO
initializeSocketIO(io);

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: process.env.URL || "http://localhost:5173", // Specify frontend URL or allow all origins
    credentials: true, // Enable credentials support
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Include PATCH method here
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    exposedHeaders: ['Authorization'], // Optionally expose headers to the client
};

// Apply CORS Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Logging middleware (for debugging)
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    console.log('Headers:', req.headers);
    next();
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/story", storyRoute);
app.use("/api/v1/notification", notificationRoute);

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Error Handling Middleware with CORS headers
app.use((err, req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.URL || "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({ message: err.message });
});

// Start server and connect to database
server.listen(PORT, () => {
    connectDB(); // Ensure your MongoDB connection is established
    console.log(`Server listening on port ${PORT}`);
});

export { io };
