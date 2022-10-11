import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import { appConfig } from "../config";
import { CustomAPIError } from "../error/custom-error";

export const sendRegistrationEmail = (
    userEmail: string,
    userID: string,
    activationKey: string
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: appConfig.EMAIL_ADDRESS,
            pass: appConfig.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: appConfig.EMAIL_ADDRESS,
        to: userEmail,
        subject: "Registration to our service.",
        text: `Thanks for registration in our service.\nTo activate your account, please use link below\nhttp://localhost:5000/api/activate_account/${userID}/${activationKey}`,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            throw new CustomAPIError(
                `${error.message}`,
                StatusCodes.BAD_REQUEST
            );
        }
    });
};
