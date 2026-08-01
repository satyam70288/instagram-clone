import mongoose from "mongoose";

const RETRY_DELAY_MS = 5000;
const MAX_RETRY_DELAY_MS = 60000;

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MONGO_URI is not set. Database will not connect.");
        return;
    }

    mongoose.connection.on("disconnected", () => {
        console.error("⚠️ mongodb disconnected");
    });
    mongoose.connection.on("error", (err) => {
        console.error("⚠️ mongodb connection error:", err?.message || err);
    });

    let delay = RETRY_DELAY_MS;

    const attempt = async () => {
        try {
            // Fail fast instead of letting queries buffer for 10s and report misleading errors
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
            console.log(`✅ mongodb connected successfully. ${new URL(uri).hostname}`);
        } catch (error) {
            console.error("❌ mongodb connection failed:", error?.message || error);
            console.error(
                "Check: MONGO_URI value, Atlas cluster is not paused, and Network Access allows 0.0.0.0/0"
            );
            // Keep retrying so a temporarily paused cluster does not require a manual restart
            console.log(`↻ retrying mongodb connection in ${delay / 1000}s`);
            setTimeout(attempt, delay);
            delay = Math.min(delay * 2, MAX_RETRY_DELAY_MS);
        }
    };

    await attempt();
};

export default connectDB;
