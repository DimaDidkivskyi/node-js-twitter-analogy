import Joi from "joi";

export const twitValidationSchema = Joi.object({
    text_of_twit: Joi.string().required(),
    attachment: Joi.string(),
    likes: Joi.number(),
    date_of_creation: Joi.date(),
});

export const commentValidationSchema = Joi.object({
    username: Joi.string(),
    text_of_comment: Joi.string().required(),
    likes: Joi.number(),
});
