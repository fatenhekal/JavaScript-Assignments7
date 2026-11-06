import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator(value) {
                    return value === value.toUpperCase()
                        ? !/\p{L}/u.test(value)
                        : true;
                },
                message: "The title must not be entirely uppercase."
            }
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
