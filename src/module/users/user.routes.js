import { Router } from "express";
import { authenticate } from "../../common/middelware/auth.middleware.js";
import {
    deleteLoggedInUser,
    getLoggedInUser,
    loginUser,
    signupUser,
    updateLoggedInUser
} from "./user.controller.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/", authenticate, getLoggedInUser);
router.delete("/", authenticate, deleteLoggedInUser);
router.patch("/:id", authenticate, updateLoggedInUser);
router.patch("/", authenticate, updateLoggedInUser);

export default router;
