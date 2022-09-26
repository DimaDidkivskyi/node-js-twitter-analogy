import Joi from "joi";

export const userValidationSchema = Joi.object({
    username: Joi.string().required().min(3).max(15),
    user_email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string().required(),
});
