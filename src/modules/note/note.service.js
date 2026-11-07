import { Types } from 'mongoose';
import { User, Note } from '../../DB/model/index.js';
import { AppError } from '../../common/utils/AppError.js';
import { assertObjectId, escapeRegex } from '../../common/utils/validators.js';

//  note login
const getOwnedNote = async (noteId, userId) => {
  assertObjectId(noteId, 'noteId');
  assertObjectId(userId, 'userId');
  const note = await Note.findById(noteId);
  if (!note) throw new AppError('Note not found', 404);
  if (note.userId.toString() !== userId) throw new AppError('You are not the owner', 403);
  return note;
};

// 1) Create
export const createNote = async (userId, { title, content } = {}) => {
  assertObjectId(userId, 'userId');
  if (!(await User.exists({ _id: userId }))) throw new AppError('User not found', 404);
  await Note.create({ title, content, userId });
};

// 2) Update single note
export const updateNote = async (noteId, userId, { title, content } = {}) => {
  const note = await getOwnedNote(noteId, userId);
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  await note.save();
  return note;
};

// 3) Replace (PUT)
export const replaceNote = async (noteId, userId, { title, content, userId: newOwner } = {}) => {
  const note = await getOwnedNote(noteId, userId);
  note.overwrite({ title, content, userId: newOwner });
  await note.save();
  return note;
};

// 4) Update title of all notes
export const updateAllTitles = async (userId, { title } = {}) => {
  assertObjectId(userId, 'userId');
  if (!title) throw new AppError('title is required', 400);
  const result = await Note.updateMany({ userId }, { $set: { title } }, { runValidators: true });
  if (result.matchedCount === 0) throw new AppError('No note found', 404);
};

// 5) Delete single note
export const deleteNote = async (noteId, userId) => {
  const note = await getOwnedNote(noteId, userId);
  await note.deleteOne();
  return note;
};

// 6) Paginate + sort
export const paginateSort = async (userId, { page, limit }) => {
  assertObjectId(userId, 'userId');
  const p = Math.max(parseInt(page) || 1, 1);
  const l = Math.max(parseInt(limit) || 10, 1);
  return Note.find({ userId })
    .sort({ createdAt: -1 })
    .skip((p - 1) * l)
    .limit(l);
};

// 7) Get by id
export const getNoteById = (noteId, userId) => getOwnedNote(noteId, userId);

// 8) Get by content
export const getNoteByContent = async (userId, content) => {
  assertObjectId(userId, 'userId');
  const note = content ? await Note.findOne({ userId, content }) : null;
  if (!note) throw new AppError('No note found', 404);
  return note;
};

// 9) Notes with user info (populate)
export const getNotesWithUser = async (userId) => {
  assertObjectId(userId, 'userId');
  return Note.find({ userId })
    .select('title userId createdAt')
    .populate('userId', 'email -_id')
    .lean();
};

// 10) Aggregate
export const aggregateNotes = async (userId, title) => {
  assertObjectId(userId, 'userId');
  const match = { userId: new Types.ObjectId(userId) };
  if (title) match.title = { $regex: escapeRegex(title), $options: 'i' };

  return Note.aggregate([
    { $match: match },
    {
      $lookup: {
        from: User.collection.name,
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        title: 1,
        userId: 1,
        createdAt: 1,
        'user.name': 1,
        'user.email': 1,
      },
    },
  ]);
};

// 11) Delete all notes
export const deleteAllNotes = async (userId) => {
  assertObjectId(userId, 'userId');
  await Note.deleteMany({ userId });
};
