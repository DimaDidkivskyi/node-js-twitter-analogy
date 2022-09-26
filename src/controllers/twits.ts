import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../error/custom-error";

import { validateTwit } from "../middlewares/validateMiddleware";
import { twitsModel } from "../models/twits";
import { userModel } from "../models/user";
import { IReqCommentData, IReqTwitData } from "../types";
import { commentValidationSchema } from "../validation/twitValidation";

// Get all twits function
export const getTwitList = async (_req: Request, res: Response) => {
    const twitList = await twitsModel.getTwitList();
    return res.status(200).json({ twitList });
};

// Get twit function
export const getTwit = async (req: Request, res: Response) => {
    const { id: twitID } = req.params;

    const twit = await twitsModel.getTwit(twitID);
    if (!twit) {
        throw new CustomAPIError(
            `Twit with id ${twitID} not found`,
            StatusCodes.NOT_FOUND
        );
    }
    return res.status(200).json({ twit });
};

// Create twit function
export const createTwit = async (req: Request, res: Response) => {
    const twitData: IReqTwitData = req.body;

    if (!req.user) {
        throw new CustomAPIError(
            "You need to be authorized",
            StatusCodes.UNAUTHORIZED
        );
    }

    validateTwit(twitData, res);

    const dateOfCreation = Date.now();

    const twit = await twitsModel.createTwit({
        ...twitData,
        date_of_creation: dateOfCreation,
    });

    const findAndUpdateUser = await userModel.addTwitToUserList(
        req.user.id,
        twit.id
    );

    return res.status(200).json({ twit, findAndUpdateUser });
};

// Create comment function
export const createComment = async (req: Request, res: Response) => {
    const { id: twitID } = req.params;

    if (!req.user) {
        throw new CustomAPIError(
            "You need to be authorized",
            StatusCodes.UNAUTHORIZED
        );
    }

    const newComment: IReqCommentData = req.body;
    const { error } = commentValidationSchema.validate(newComment);
    if (error) {
        throw new CustomAPIError(error.message, StatusCodes.BAD_REQUEST);
    }

    const dateOfCreation = Date.now();

    const addCommentToTwit = await twitsModel.createComment(twitID, {
        ...newComment,
        userId: req.user.id,
        username: req.user.username,
        date_of_creation: dateOfCreation,
    });
    if (!addCommentToTwit) {
        throw new CustomAPIError(
            `Item with id: ${twitID} doesn't exist.`,
            StatusCodes.NOT_FOUND
        );
    }
    return res.status(200).json({ addCommentToTwit });
};

// Update twit function
export const updateTwit = async (req: Request, res: Response) => {
    const { id: twitID } = req.params;

    const updateData: IReqTwitData = req.body;

    const singleTwit = await twitsModel.getTwitAndUpdate(twitID, updateData);
    if (!singleTwit) {
        throw new CustomAPIError(
            `Item with id: ${twitID} doesn't exist`,
            StatusCodes.NOT_FOUND
        );
    }

    return res.status(200).json({ singleTwit });
};

// Delete twit function
export const deleteTwit = async (req: Request, res: Response) => {
    const { id: twitID } = req.params;

    const twitById = await twitsModel.deleteTwit(twitID);
    if (!twitById) {
        throw new CustomAPIError(
            `Item with id: ${twitID} doesn't exist`,
            StatusCodes.NOT_FOUND
        );
    }

    return res
        .status(200)
        .json({ message: `Item with id: ${twitID} was deleted.` });
};
