import { asyncHandler } from '../../common/utils/asyncHandler.js';
import * as service from './note.service.js';

export const createNote = asyncHandler(async (req, res) => {
  await service.createNote(req.query.userId, req.body);
  res.status(201).json({ message: 'Note created' });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await service.updateNote(req.params.noteId, req.query.userId, req.body);
  res.status(200).json({ message: 'updated', note });
});

export const replaceNote = asyncHandler(async (req, res) => {
  const note = await service.replaceNote(req.params.noteId, req.query.userId, req.body);
  res.status(200).json(note);
});

export const updateAllTitles = asyncHandler(async (req, res) => {
  await service.updateAllTitles(req.query.userId, req.body);
  res.status(200).json({ message: 'All notes updated' });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await service.deleteNote(req.params.noteId, req.query.userId);
  res.status(200).json({ message: 'deleted', note });
});

export const paginateSort = asyncHandler(async (req, res) => {
  const notes = await service.paginateSort(req.query.userId, req.query);
  res.status(200).json(notes);
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await service.getNoteById(req.params.noteId, req.query.userId);
  res.status(200).json(note);
});

export const getNoteByContent = asyncHandler(async (req, res) => {
  const note = await service.getNoteByContent(req.query.userId, req.query.content);
  res.status(200).json(note);
});

export const getNotesWithUser = asyncHandler(async (req, res) => {
  res.status(200).json(await service.getNotesWithUser(req.query.userId));
});

export const aggregateNotes = asyncHandler(async (req, res) => {
  res.status(200).json(await service.aggregateNotes(req.query.userId, req.query.title));
});

export const deleteAllNotes = asyncHandler(async (req, res) => {
  await service.deleteAllNotes(req.query.userId);
  res.status(200).json({ message: 'Deleted' });
});
