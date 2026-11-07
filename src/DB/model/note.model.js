import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        // "FIRST NOTE" ✗   |   "First Note" ✓
        validator: (value) => value !== value.toUpperCase(),
        message: 'Title must not be entirely uppercase',
      },
    },
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true, // بيضيف createdAt و updatedAt تلقائي
    toJSON: {
      transform: (doc, ret) => {
        const { _id, __v, ...rest } = ret;
        return { id: _id, ...rest };
      },
    },
  }
);

export const Note = mongoose.model('Note', noteSchema);