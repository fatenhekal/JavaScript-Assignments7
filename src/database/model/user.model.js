import mongoose from "mongoose";
import { hashPassword } from "../../common/utilites/password.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            min: 18,
            max: 60
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await hashPassword(this.password);
    }
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
