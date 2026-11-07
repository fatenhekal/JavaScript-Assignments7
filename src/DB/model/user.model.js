import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  age: {
    type: Number,
    min: [18, 'Age must be at least 18'],
    max: [60, 'Age must be at most 60'],
  },
});

export const User = mongoose.model('User', userSchema);