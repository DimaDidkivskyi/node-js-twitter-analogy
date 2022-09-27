import express from "express";
import { authUserMiddleware } from "../auth/authMiddleware";
import {
    accountAcctivation,
    addFollow,
    getAllUsers,
    getUser,
    refreshUserToken,
    updatePassword,
    updateUserInfo,
    userAuthorization,
    userRegistration,
} from "../controllers/user";
import { functionWrapper } from "../middlewares/funcWrapper";

export const userRouter = express.Router();

// Get user list
userRouter.get("/user_list", functionWrapper(getAllUsers));

// Get single user by ID
userRouter.get("/profile_page/:id", functionWrapper(getUser));

// Login
userRouter.post("/login", functionWrapper(userAuthorization));

// Refresh access token
userRouter.post("/refresh_token", functionWrapper(refreshUserToken));

// Registration
userRouter.post("/registration", functionWrapper(userRegistration));

userRouter.put(
    "/activate-account/:id/:key",
    functionWrapper(accountAcctivation)
);

// Update user info
userRouter.put(
    "/update_info",
    authUserMiddleware,
    functionWrapper(updateUserInfo)
);

// Change passwrod
userRouter.put(
    "/change_password",
    authUserMiddleware,
    functionWrapper(updatePassword)
);

// Adding followers
userRouter.put("/follow/:id", authUserMiddleware, functionWrapper(addFollow));
