import mongoose from "mongoose";
import { appConfig } from "../config";

export const connectToDB = () => mongoose.connect(appConfig.DB_URL);
