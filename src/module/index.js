import { Router } from "express";
import userRoutes from "./users/user.routes.js";
import noteRoutes from "./notes/note.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/notes", noteRoutes);

export default router;
