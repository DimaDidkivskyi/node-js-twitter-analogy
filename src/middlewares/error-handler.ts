import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CustomAPIError } from "../error/custom-error";

export const errorHandlerMiddleware = (
    error: Error,
    _req: Request,
    res: Response
) => {
    if (error instanceof CustomAPIError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    throw new CustomAPIError(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
    );
};
