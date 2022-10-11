import mongoose from "mongoose";
import { IReqCommentData, IReqTwitData } from "../types";
import { commentsSchema } from "./comments";

const twtisSchema = new mongoose.Schema({
    text_of_twit: {
        type: String,
        required: [true, "This field can't be empty."],
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [commentsSchema],
    },
    date_of_creation: {
        type: Date,
    },
});

const Twits = mongoose.model("Twits", twtisSchema);

export const getAllTwits = Twits.find();

export const twitsModel = {
    getTwitList: () => Twits.find(),

    getTwit: (id: string) => Twits.findOne({ _id: id }),

    getUsersTwits: (id: string[]) => Twits.find({ _id: { $in: id } }),

    createTwit: (twitData: IReqTwitData) => Twits.create(twitData),

    // !!!!!!!!!!!!!!
    createComment: (id: string, commentData: IReqCommentData) =>
        Twits.findOneAndUpdate(
            { _id: id },
            { $push: { comments: commentData } },
            { new: true, runValidators: true }
        ),

    getTwitAndUpdate: (id: string, updateData: IReqTwitData) =>
        Twits.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true, runValidators: true }
        ),

    deleteTwit: (id: string) => Twits.findOneAndDelete({ _id: id }),
};
