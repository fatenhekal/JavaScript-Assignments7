import { httpError } from "../../common/utilites/http-error.js";
import {
    createNote,
    deleteAllNotes,
    deleteNote,
    getNoteByContent,
    getNoteById,
    getNotesAggregate,
    getNotesWithUserEmail,
    getPaginatedNotes,
    replaceNote,
    updateAllNoteTitles,
    updateNote
} from "./note.service.js";

const getUserId = (req) => {
    const userId = req.query.id;
    if (!userId) {
        throw httpError(400, "Logged-in user id is required in the id query parameter.");
    }

    if (userId !== req.auth.userId) {
        throw httpError(403, "You can only access your own notes.");
    }

    return userId;
};

const getBody = (req) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        throw httpError(400, "A JSON object is required in the request body.");
    }

    return req.body;
};

export const createNoteController = async (req, res) => {
    const note = await createNote(getUserId(req), getBody(req));
    return res.status(201).json({ message: "Note created successfully.", note });
};

export const updateNoteController = async (req, res) => {
    const note = await updateNote(req.params.noteId, getUserId(req), getBody(req));
    return res.status(200).json({ message: "Note updated successfully.", note });
};

export const replaceNoteController = async (req, res) => {
    const note = await replaceNote(req.params.noteId, getUserId(req), getBody(req));
    return res.status(200).json({ message: "Note replaced successfully.", note });
};

export const updateAllNoteTitlesController = async (req, res) => {
    const result = await updateAllNoteTitles(getUserId(req), req.body?.title);
    return res.status(200).json({ message: "Note titles updated successfully.", ...result });
};

export const deleteNoteController = async (req, res) => {
    const note = await deleteNote(req.params.noteId, getUserId(req));
    return res.status(200).json({ message: "Note deleted successfully.", note });
};

export const getPaginatedNotesController = async (req, res) => {
    const result = await getPaginatedNotes(getUserId(req), req.query.page, req.query.limit);
    return res.status(200).json(result);
};

export const getNoteByIdController = async (req, res) => {
    const note = await getNoteById(req.params.noteId, getUserId(req));
    return res.status(200).json({ note });
};

export const getNoteByContentController = async (req, res) => {
    const note = await getNoteByContent(getUserId(req), req.query.content);
    if (!note) {
        throw httpError(404, "Note not found.");
    }

    return res.status(200).json({ note });
};

export const getNotesWithUserEmailController = async (req, res) => {
    const notes = await getNotesWithUserEmail(getUserId(req));
    return res.status(200).json({ notes });
};

export const getNotesAggregateController = async (req, res) => {
    const notes = await getNotesAggregate(getUserId(req), req.query.title);
    return res.status(200).json({ notes });
};

export const deleteAllNotesController = async (req, res) => {
    const result = await deleteAllNotes(getUserId(req));
    return res.status(200).json({ message: "All notes deleted successfully.", ...result });
};
