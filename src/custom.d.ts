import { IUserTokenPayload } from "./types";

declare global {
    namespace Express {
        export interface Request {
            user?: IUserTokenPayload;
        }
    }
}
