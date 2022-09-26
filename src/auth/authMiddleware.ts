import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { decode, verify } from "jsonwebtoken";
import { appConfig } from "../config";
import { CustomAPIError } from "../error/custom-error";

export const authUserMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomAPIError("No token provided", StatusCodes.UNAUTHORIZED);
    }
    const token = authHeader.split(" ")[1];

    try {
        if (token && verify(token, appConfig.JWT_SECRET || "")) {
            req.user =
                (decode(token) as { id: string; username: string }) ||
                undefined;
        }
    } catch (error) {
        throw new CustomAPIError(
            "Not authorized to access this route.",
            StatusCodes.UNAUTHORIZED
        );
    }
    next();
};
