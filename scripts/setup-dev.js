import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envFilePath = resolve(projectRoot, ".env.development");

if (existsSync(envFilePath)) {
    console.error(".env.development already exists; it was left unchanged.");
    process.exitCode = 1;
} else {
    const contents = [
        "PORT=3000",
        "DB_URI=mongodb://127.0.0.1:27017/sticky-notes",
        `JWT_SECRET=${randomBytes(32).toString("base64url")}`,
        ""
    ].join("\n");

    writeFileSync(envFilePath, contents, { flag: "wx" });
    console.log("Created .env.development with a secure random JWT secret.");
    console.log("Make sure MongoDB is running, then start the app with npm run start:dev.");
}
