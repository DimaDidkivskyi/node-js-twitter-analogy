import exress from "express";
import { authUserMiddleware } from "../auth/authMiddleware";
import {
    getTwitList,
    getTwit,
    createTwit,
    createComment,
    updateTwit,
    deleteTwit,
} from "../controllers/twits";
import { functionWrapper } from "../middlewares/funcWrapper";

export const twitsRoute = exress.Router();

// Get list of twits
twitsRoute.get("/home", functionWrapper(getTwitList));

// Get single twit by ID
twitsRoute.get("/twit/:id", functionWrapper(getTwit));

// Create twit
twitsRoute.post("/tweet", authUserMiddleware, functionWrapper(createTwit));

// Create comments to twit
twitsRoute.post(
    "/twit/:id/addcomment",
    authUserMiddleware,
    functionWrapper(createComment)
);

// Update twit by ID
twitsRoute.put("/twit/:id", functionWrapper(updateTwit));

// Delete twit by id
twitsRoute.delete("/twit/:id", functionWrapper(deleteTwit));
