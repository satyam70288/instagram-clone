import mongoose from "mongoose";

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

    try {
        // Fail fast instead of letting queries buffer for 10s and report misleading errors
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
        console.log(`✅ mongodb connected successfully. ${new URL(uri).hostname}`);
    } catch (error) {
        console.error("❌ mongodb connection failed:", error?.message || error);
        console.error(
            "Check: MONGO_URI value, Atlas cluster is not paused, and Network Access allows 0.0.0.0/0"
        );
    }
};

export default connectDB;
