import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const saltLength = 16;
const keyLength = 64;

export const hashPassword = async (password) => {
    const salt = randomBytes(saltLength).toString("hex");
    const derivedKey = await scrypt(password, salt, keyLength);
    return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifyPassword = async (password, storedHash) => {
    const [salt, keyHex] = storedHash.split(":");
    if (!salt || !keyHex || !/^[a-f\d]+$/i.test(keyHex)) {
        return false;
    }

    const expectedKey = Buffer.from(keyHex, "hex");
    if (expectedKey.length !== keyLength) {
        return false;
    }

    const actualKey = await scrypt(password, salt, keyLength);
    return timingSafeEqual(expectedKey, actualKey);
};
