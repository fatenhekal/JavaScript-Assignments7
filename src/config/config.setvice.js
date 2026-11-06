import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
const envFilePath = resolve(`.env.${process.env.NODE_ENV}`);
loadEnv({ path: envFilePath });

export default {
    port: Number(process.env.PORT || process.env.port) || 3000,
    dbUri: process.env.DB_URI || process.env.DB_uri,
    jwtSecret: process.env.JWT_SECRET
};
