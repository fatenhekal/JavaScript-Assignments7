import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve('.env.development') });

export const PORT = process.env.PORT || 3000;
export const DB_URI = process.env.DB_URI;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;