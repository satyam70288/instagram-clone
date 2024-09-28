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
import storyRoute from './routes/story.route.js'
import notificationRoute from "./routes/notification.routes.js";
import messageRoute from "./routes/message.route.js";
import { initializeSocketIO } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ['GET', 'POST'],
    },
});

// Initialize Socket.IO
initializeSocketIO(io);

// Middleware setup
app.use(express.json());
app.use(cookieParser());
// app.use(urlencoded({ extended: true }));

const corsOptions = {
    origin: process.env.URL, // Use an array to specify multiple origins
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: ['Authorization'], // Optionally expose headers to the client
};


app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/story",storyRoute );
app.use("/api/v1/notification",notificationRoute);

// Static Files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve frontend if needed
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
export { io };

// Start server
server.listen(PORT, () => {
    connectDB();
    console.log(`Server listening on port ${PORT}`);
});
