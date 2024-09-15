import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const hostname = new URL(process.env.MONGO_URI).hostname;
        console.log(`mongodb connected successfully.${hostname}`);
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;