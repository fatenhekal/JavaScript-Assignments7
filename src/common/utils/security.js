import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import { SALT_ROUNDS, ENCRYPTION_KEY } from '../../config/config.service.js';

export const hash = (plain) => bcrypt.hash(plain, SALT_ROUNDS);
export const compareHash = (plain, hashed) => bcrypt.compare(plain, hashed);

export const encrypt = (text) =>
  CryptoJS.AES.encrypt(String(text), ENCRYPTION_KEY).toString();
