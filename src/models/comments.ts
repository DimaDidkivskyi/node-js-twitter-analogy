import mongoose from "mongoose";

export const commentsSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    username: {
        type: String,
    },
    text_of_comment: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    date_of_creation: {
        type: Date,
    },
});
