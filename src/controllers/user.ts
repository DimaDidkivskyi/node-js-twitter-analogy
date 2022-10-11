import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { decode, verify } from "jsonwebtoken";
import crypto from "crypto";
import { createAccessToken, createRefreshToken } from "../auth/createToken";
import { passwordHash } from "../auth/passwordHash";
import { appConfig } from "../config";
import { CustomAPIError } from "../error/custom-error";
import { sendRegistrationEmail } from "../middlewares/sending-email";
import { twitsModel } from "../models/twits";
import { userModel } from "../models/user";
import { IReqUserData } from "../types";
import { userValidationSchema } from "../validation/userValidation";

// Get all users function
export const getAllUsers = async (_req: Request, res: Response) => {
    const userList = await userModel.getAllUsers();
    return res.status(StatusCodes.OK).json(userList);
};

// Get user function
export const getUser = async (req: Request, res: Response) => {
    const { id: userID } = req.params;

    const singleUser = await userModel.getUserById(userID);
    if (!singleUser) {
        throw new CustomAPIError(
            `User with id: ${userID} not found.`,
            StatusCodes.NOT_FOUND
        );
    }

    const twitsList = await twitsModel.getUsersTwits(singleUser.twits);

    return res.status(StatusCodes.OK).json({ singleUser, twitsList });
};

// User authorization function
export const userAuthorization = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomAPIError(
            "Please, provide email and password",
            StatusCodes.BAD_REQUEST
        );
    }

    const userCheck = await userModel.getUserByEmail(email);
    if (!userCheck) {
        throw new CustomAPIError(
            `User with email: ${email} doesn't exist.`,
            StatusCodes.NOT_FOUND
        );
    }

    const encryptedPassword = passwordHash(password);

    if (userCheck.password !== encryptedPassword) {
        throw new CustomAPIError(
            "Incorrect password.",
            StatusCodes.BAD_REQUEST
        );
    }

    createRefreshToken(
        { id: userCheck.id, username: userCheck.username! },
        res
    );

    return res.status(StatusCodes.OK).json({
        message: "Authorization completed",
        token: createAccessToken({
            id: userCheck.id,
            username: userCheck.username!,
        }),
    });
};

// Refresh access token
export const refreshUserToken = async (req: Request, res: Response) => {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (
        refreshTokenCookie &&
        verify(refreshTokenCookie, appConfig.JWT_SECRET || "")
    ) {
        const decodeToken = decode(refreshTokenCookie) as {
            id: string;
            username: string;
        };

        createRefreshToken(
            { id: decodeToken.id, username: decodeToken.username },
            res
        );

        return res.status(StatusCodes.OK).json({
            message: "Token refreshed",
            token: createAccessToken({
                id: decodeToken.id,
                username: decodeToken.username,
            }),
        });
    }

    return res
        .status(StatusCodes.SERVICE_UNAVAILABLE)
        .json({ error: true, message: "Failed to refresh token." });
};

// User registration function
export const userRegistration = async (req: Request, res: Response) => {
    const userData: IReqUserData = req.body;
    const { error } = userValidationSchema.validate(userData);
    if (error) {
        throw new CustomAPIError(error.message, StatusCodes.BAD_REQUEST);
    }

    const user = await userModel.getUserByEmail(userData.user_email);
    if (user) {
        throw new CustomAPIError(
            `${userData.user_email} already taken.`,
            StatusCodes.BAD_REQUEST
        );
    }

    const userKey = crypto.randomBytes(20).toString("hex");

    const createUser = await userModel.createUser({
        ...userData,
        password: passwordHash(userData.password),
        activationKey: userKey,
    });

    await sendRegistrationEmail(
        createUser.user_email!,
        createUser.id,
        createUser.activationKey!
    );

    return res.status(StatusCodes.OK).json({
        message: "Registartion completed",
    });
};

// Account activation
export const accountAcctivation = async (req: Request, res: Response) => {
    const { id: userID, key: activationKey } = req.params;

    const findUser = await userModel.getUserById(userID);

    if (findUser?.activationKey === activationKey) {
        await userModel.updateActiveStatus(userID);
    } else {
        throw new CustomAPIError(
            "The keys don't match",
            StatusCodes.BAD_REQUEST
        );
    }
    return res
        .status(StatusCodes.OK)
        .json({ message: "Your account activated." });
};

// Update user info fucntion
export const updateUserInfo = async (req: Request, res: Response) => {
    const updateData = req.body;
    // !!!
    const findUser = await userModel.updateUser(req.user?.id!, updateData);

    return res.status(StatusCodes.OK).json({ findUser });
};

// Update user password function
export const updatePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    const findUser = await userModel.getUserById(req.user?.id!);

    const oldEncryptedPassword = passwordHash(oldPassword);

    if (oldEncryptedPassword === findUser!.password) {
        const newEncryptedPassword = passwordHash(newPassword);

        await userModel.updatePassword(req.user?.id!, newEncryptedPassword);
    }
    return res
        .status(StatusCodes.OK)
        .json({ message: "Password successfully changed" });
};

// Add follow function
export const addFollow = async (req: Request, res: Response) => {
    const { id: openedUserId } = req.params;

    const findUserAndUpdate = await userModel.addFollow(
        // !!!
        req.user?.id!,
        openedUserId
    );
    return res.status(StatusCodes.OK).json({ findUserAndUpdate });
};
