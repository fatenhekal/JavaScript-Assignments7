import { AppError } from './AppError.js';

export const assertObjectId = (id, label = 'id') => {
  if (!/^[a-f\d]{24}$/i.test(String(id ?? ''))) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};

export const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
