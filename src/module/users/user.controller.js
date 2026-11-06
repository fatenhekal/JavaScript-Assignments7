import { httpError } from "../../common/utilites/http-error.js";
import {
    deleteUserById,
    getUserById,
    login,
    signup,
    updateUser
} from "./user.service.js";

export const signupUser = async (req, res) => {
    const user = await signup(req.body ?? {});
    return res.status(201).json({ message: "User created successfully.", user });
};

export const loginUser = async (req, res) => {
    const result = await login(req.body ?? {});
    return res.status(200).json({ message: "Login successful.", ...result });
};

export const updateLoggedInUser = async (req, res) => {
    const userId = getRequestedUserId(req);
    const user = await updateUser(userId, req.body ?? {});
    return res.status(200).json({ message: "User updated successfully.", user });
};

export const getLoggedInUser = async (req, res) => {
    const user = await getUserById(getRequestedUserId(req));
    return res.status(200).json({ user });
};

export const deleteLoggedInUser = async (req, res) => {
    const user = await deleteUserById(getRequestedUserId(req));
    return res.status(200).json({ message: "User deleted successfully.", user });
};

const getRequestedUserId = (req) => {
    const userId = req.params.id || req.query.id;
    if (!userId) {
        throw httpError(400, "User id is required in the URL or query string.");
    }

    if (userId !== req.auth.userId) {
        throw httpError(403, "You can only access your own account.");
    }

    return userId;
};
