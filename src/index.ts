import express, { json } from "express";
import cookieParser from "cookie-parser";
import { appConfig } from "./config";
import { connectToDB } from "./db/connect";
import { twitsRoute } from "./routes/twits";
import { userRouter } from "./routes/user";
import { errorHandlerMiddleware } from "./middlewares/error-handler";

const app = express();

app.use("/", express.static("public"));
app.use(json());
app.use(cookieParser());

app.use("/api/", twitsRoute);
app.use("/api/", userRouter);
app.use(errorHandlerMiddleware);

const startServer = async () => {
    try {
        await connectToDB();
        return app.listen(appConfig.PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is listening on port ${appConfig.PORT}...`);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        return console.log(error);
    }
};

startServer();

// Comment for test commit
