import { Router } from "express";
import { authenticate } from "../../common/middelware/auth.middleware.js";
import {
    createNoteController,
    deleteAllNotesController,
    deleteNoteController,
    getNoteByContentController,
    getNoteByIdController,
    getNotesAggregateController,
    getNotesWithUserEmailController,
    getPaginatedNotesController,
    replaceNoteController,
    updateAllNoteTitlesController,
    updateNoteController
} from "./note.controller.js";

const router = Router();

router.use(authenticate);
router.post("/", createNoteController);
router.patch("/all", updateAllNoteTitlesController);
router.get("/paginate-sort", getPaginatedNotesController);
router.get("/note-by-content", getNoteByContentController);
router.get("/note-with-user", getNotesWithUserEmailController);
router.get("/aggregate", getNotesAggregateController);
router.delete("/", deleteAllNotesController);
router.put("/replace/:noteId", replaceNoteController);
router.patch("/:noteId", updateNoteController);
router.delete("/:noteId", deleteNoteController);
router.get("/:noteId", getNoteByIdController);

export default router;
