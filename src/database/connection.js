import mongoose from "mongoose";
import config from "../config/config.setvice.js";

export const connectDB = async () => {
    if (!config.dbUri) {
        throw new Error("DB_URI must be configured before starting the application.");
    }

    await mongoose.connect(config.dbUri);
    console.log("Connected to MongoDB");
};