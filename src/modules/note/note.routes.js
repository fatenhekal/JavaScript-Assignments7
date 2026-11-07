import { Router } from 'express';
import * as controller from './note.controller.js';

const router = Router();

router.post('/', controller.createNote);
router.delete('/', controller.deleteAllNotes);

router.patch('/all', controller.updateAllTitles);
router.put('/replace/:noteId', controller.replaceNote);

router.get('/paginate-sort', controller.paginateSort);
router.get('/note-by-content', controller.getNoteByContent);
router.get('/note-with-user', controller.getNotesWithUser);
router.get('/aggregate', controller.aggregateNotes);

router.patch('/:noteId', controller.updateNote);
router.delete('/:noteId', controller.deleteNote);
router.get('/:noteId', controller.getNoteById);

export default router;
