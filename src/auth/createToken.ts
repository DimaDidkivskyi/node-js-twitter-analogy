import { sign } from "jsonwebtoken";
import { Response } from "express";
import { appConfig } from "../config";
import { IUserTokenPayload } from "../types";

export const createAccessToken = (payload: IUserTokenPayload) =>
    sign(payload, appConfig.JWT_SECRET, { expiresIn: "15m" });

export const createRefreshToken = (
    payload: IUserTokenPayload,
    res: Response
) => {
    res.cookie(
        "refreshToken",
        sign(payload, appConfig.JWT_SECRET, { expiresIn: "7d" }),
        {
            httpOnly: true,
            sameSite: "lax",
        }
    );
};
