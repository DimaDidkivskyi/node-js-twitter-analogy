import { Request, Response } from "express";

export const functionWrapper =
    (fn: (...params: any[]) => any) =>
    (req: Request, res: Response, next: (error: Error) => any) =>
        Promise.resolve(fn(req, res, next)).catch((error) => next(error));
