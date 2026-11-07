import { asyncHandler } from '../../common/utils/asyncHandler.js';
import * as service from './user.service.js';

export const signup = asyncHandler(async (req, res) => {
  await service.signup(req.body);
  res.status(201).json({ message: 'User added successfully.' });
});

export const login = asyncHandler(async (req, res) => {
  const userId = await service.login(req.body);
  res.status(200).json({ message: 'Login successful', userId });
});

export const updateUser = asyncHandler(async (req, res) => {
  await service.updateUser(req.params.id, req.body);
  res.status(200).json({ message: 'User updated' });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await service.deleteUser(req.query.id);
  res.status(200).json({ message: 'User deleted' });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await service.getUser(req.query.id);
  res.status(200).json(user);
});
