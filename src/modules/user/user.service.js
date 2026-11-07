import { User, Note } from '../../DB/model/index.js';
import { AppError } from '../../common/utils/AppError.js';
import { assertObjectId } from '../../common/utils/validators.js';
import { hash, compareHash, encrypt } from '../../common/utils/security.js';

// 1) Signup
export const signup = async ({ name, email, password, phone, age }) => {
  if (!name || !email || !password || !phone) {
    throw new AppError('name, email, password and phone are required', 400);
  }
  if (await User.exists({ email })) throw new AppError('Email already exists.', 409);

  await User.create({
    name,
    email,
    age,
    password: await hash(password),
    phone: encrypt(phone),
  });
};

// 2) Login
export const login = async ({ email, password }) => {
  const user = email && password ? await User.findOne({ email }) : null;
  if (!user || !(await compareHash(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  return user._id;
};

// 3) Update user
export const updateUser = async (id, body = {}) => {
  assertObjectId(id);
  const updates = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.age !== undefined) updates.age = body.age;
  if (body.phone !== undefined) updates.phone = encrypt(body.phone);
  if (body.email !== undefined) {
    if (await User.exists({ email: body.email, _id: { $ne: id } })) {
      throw new AppError('Email already exists.', 409);
    }
    updates.email = body.email;
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', 404);
};

// 4) Delete user
export const deleteUser = async (id) => {
  assertObjectId(id);
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError('User not found', 404);
  await Note.deleteMany({ userId: id });
};

// 5) Get user
export const getUser = async (id) => {
  assertObjectId(id);
  const user = await User.findById(id).select('-__v');
  if (!user) throw new AppError('User not found', 404);
  return user;
};
