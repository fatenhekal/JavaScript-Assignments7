import express from "express";
import config from "./config/config.setvice.js";
import { connectDB } from "./database/connection.js";
import apiRoutes from "./module/index.js";
import { errorHandler } from "./common/middelware/error-handler.js";

const app = express();
const port = config.port;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Sticky Notes API is running"
    });
});

app.use(apiRoutes);
app.use(errorHandler);

const startServer = async () => {
    if (!config.jwtSecret) {
        throw new Error("JWT_SECRET must be configured before starting the application.");
    }

    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    const safeMessage = message.replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, "mongodb+srv://[redacted]");
    console.error("Failed to start the application:", safeMessage);
    process.exitCode = 1;
});