import mongoose from "mongoose";
import { IReqUserData } from "../types";
// import { followSchema } from "./follow";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    user_email: {
        type: String,
    },
    password: {
        type: String,
    },
    follow: {
        type: Array,
    },
    profile_image: {
        type: String,
    },
    about_user: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    twits: {
        type: [String],
    },
    active: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);

export const userModel = {
    getAllUsers: () => User.find(),
    getUserById: (id: string) => User.findOne({ _id: id }),

    getUserByEmail: (email: string) => User.findOne({ user_email: email }),

    createUser: (userData: IReqUserData) => User.create(userData),

    updateUser: (id: string, userData: IReqUserData) =>
        User.findOneAndUpdate(
            { _id: id },
            { $set: userData },
            { new: true, runValidators: true }
        ),

    updatePassword: (id: string, newPassword: string) =>
        User.findOneAndUpdate({ _id: id }, { $set: { password: newPassword } }),

    addFollow: (id: string, userId: string) =>
        User.findOneAndUpdate(
            { _id: id },
            {
                $push: {
                    follow: userId,
                },
            },
            { new: true }
        ),

    addTwitToUserList: (id: string, twitId: string) =>
        User.findOneAndUpdate(
            { _id: id },
            { $push: { twits: twitId } },
            { new: true }
        ),
};
