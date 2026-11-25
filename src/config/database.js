import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(env.MONGODB_URI);

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        )

    } catch (err) {
        console.log(`MongoDB connection failed:`, err.message);
        process.exit(1);
    }
}

export default connectDB;