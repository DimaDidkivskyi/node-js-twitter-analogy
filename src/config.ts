import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const validationSchema = Joi.object({
    DB_URL: Joi.string().required(),
    PORT: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    EMAIL_ADDRESS: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),
});

export const appConfig = {
    DB_URL: process.env.DB_CONN_STRING as string,
    PORT: process.env.PORT ?? "4000",
    JWT_SECRET: process.env.JWT_SECRET as string,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS as string,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
} as const;

const { error } = validationSchema.validate(appConfig);

if (error) {
    throw new Error(`Env file validation error: ${error.details[0].message}`);
}
