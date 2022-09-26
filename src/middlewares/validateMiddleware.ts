import { Response } from "express";
import { twitValidationSchema } from "../validation/twitValidation";

// eslint-disable-next-line consistent-return
export const validateTwit = (twitData: {}, res: Response) => {
    const { error } = twitValidationSchema.validate(twitData);
    if (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};
