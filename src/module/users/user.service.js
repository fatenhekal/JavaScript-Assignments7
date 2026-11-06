import { User } from "../../database/model/user.model.js";
import { httpError } from "../../common/utilites/http-error.js";
import { verifyPassword } from "../../common/utilites/password.js";
import { createAccessToken } from "../../common/utilites/token.js";
import config from "../../config/config.setvice.js";

const publicUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    age: user.age,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

export const signup = async (input) => {
    const { name, email, password, phone, age } = input;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : email;

    if (normalizedEmail && await User.exists({ email: normalizedEmail })) {
        throw httpError(409, "Email already exists.");
    }

    const user = await User.create({ name, email: normalizedEmail, password, phone, age });
    return publicUser(user);
};

export const login = async ({ email, password }) => {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : email;
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user || typeof password !== "string" ||
        !(await verifyPassword(password, user.password))) {
        throw httpError(401, "Invalid email or password.");
    }

    return {
        user: publicUser(user),
        accessToken: createAccessToken(user.id, config.jwtSecret)
    };
};

export const updateUser = async (userId, input) => {
    const allowedFields = ["name", "email", "phone", "age"];
    const updates = Object.fromEntries(
        Object.entries(input).filter(([field]) => allowedFields.includes(field))
    );

    if (Object.keys(updates).length === 0) {
        throw httpError(400, "Provide at least one editable field: name, email, phone, or age.");
    }

    if (typeof updates.email === "string") {
        updates.email = updates.email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: updates.email, _id: { $ne: userId } });
        if (existingUser) {
            throw httpError(409, "Email already exists.");
        }
    }

    const user = await User.findById(userId);
    if (!user) {
        throw httpError(404, "User not found.");
    }

    Object.assign(user, updates);
    await user.save();
    return publicUser(user);
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw httpError(404, "User not found.");
    }

    return publicUser(user);
};

export const deleteUserById = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw httpError(404, "User not found.");
    }

    return publicUser(user);
};
