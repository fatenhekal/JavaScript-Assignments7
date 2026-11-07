import { config as loadEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const envFilePaths = process.env.NODE_ENV
    ? [
        resolve(projectRoot, `.env.${process.env.NODE_ENV}`),
        resolve(projectRoot, ".env")
    ]
    : resolve(projectRoot, ".env");

loadEnv({ path: envFilePaths });

export default {
    port: Number(process.env.PORT || process.env.port) || 3000,
    dbUri: process.env.DB_URI || process.env.DB_uri,
    jwtSecret: process.env.JWT_SECRET
};
