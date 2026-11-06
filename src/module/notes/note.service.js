import mongoose from "mongoose";
import { Note } from "../../database/model/note.model.js";
import { httpError } from "../../common/utilites/http-error.js";

const noteFields = ["title", "content"];

const getNoteUpdates = (input, { requireAll = false } = {}) => {
    const updates = Object.fromEntries(
        Object.entries(input).filter(([field]) => noteFields.includes(field))
    );

    if (Object.keys(updates).length === 0 ||
        (requireAll && noteFields.some((field) => !(field in updates)))) {
        throw httpError(
            400,
            requireAll
                ? "Both title and content are required to replace a note."
                : "Provide a title or content to update."
        );
    }

    return updates;
};

const findOwnedNote = async (noteId, userId) => {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
        throw httpError(404, "Note not found.");
    }

    return note;
};

export const createNote = async (userId, input) => {
    const { title, content } = input;
    return Note.create({ title, content, userId });
};

export const updateNote = async (noteId, userId, input) => {
    const note = await findOwnedNote(noteId, userId);
    Object.assign(note, getNoteUpdates(input));
    await note.save();
    return note;
};

export const replaceNote = async (noteId, userId, input) => {
    const note = await findOwnedNote(noteId, userId);
    Object.assign(note, getNoteUpdates(input, { requireAll: true }));
    await note.save();
    return note;
};

export const updateAllNoteTitles = async (userId, title) => {
    if (typeof title !== "string" || !title.trim()) {
        throw httpError(400, "A non-empty title is required.");
    }

    const result = await Note.updateMany(
        { userId },
        { $set: { title: title.trim() } },
        { runValidators: true }
    );
    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
};

export const deleteNote = async (noteId, userId) => {
    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) {
        throw httpError(404, "Note not found.");
    }

    return note;
};

export const getPaginatedNotes = async (userId, pageValue, limitValue) => {
    const page = pageValue === undefined ? 1 : Number(pageValue);
    const limit = limitValue === undefined ? 10 : Number(limitValue);
    if (!Number.isInteger(page) || page < 1 ||
        !Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw httpError(400, "Page must be positive and limit must be between 1 and 100.");
    }

    const filter = { userId };
    const [notes, total] = await Promise.all([
        Note.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Note.countDocuments(filter)
    ]);

    return { notes, page, limit, total, pages: Math.ceil(total / limit) };
};

export const getNoteById = (noteId, userId) => findOwnedNote(noteId, userId);

export const getNoteByContent = async (userId, content) => {
    if (typeof content !== "string") {
        throw httpError(400, "The content query parameter is required.");
    }

    return Note.findOne({ userId, content });
};

export const getNotesWithUserEmail = (userId) => Note.find({ userId })
    .select("title userId createdAt")
    .populate({ path: "userId", select: "email" });

export const getNotesAggregate = (userId, title) => {
    const match = { userId: new mongoose.Types.ObjectId(userId) };
    if (typeof title === "string" && title.trim()) {
        const escapedTitle = title.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        match.title = { $regex: escapedTitle, $options: "i" };
    }

    return Note.aggregate([
        { $match: match },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                title: 1,
                userId: 1,
                createdAt: 1,
                user: { name: "$user.name", email: "$user.email" }
            }
        },
        { $sort: { createdAt: -1 } }
    ]);
};

export const deleteAllNotes = async (userId) => {
    const result = await Note.deleteMany({ userId });
    return { deletedCount: result.deletedCount };
};
