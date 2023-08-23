import { ServerRoute } from "@hapi/hapi";
import { UserOnboardingController } from "../controllers/onboarding.controller";
import Joi from 'joi';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const onboardingRoutes: ServerRoute[] = [
    {
        method: "POST",
        path: "/signup",
        handler: UserOnboardingController.signup,
        options: {
            validate: {
                payload : Joi.object({
                    fullName: Joi.string().required(),
                    email:Joi.string().pattern(emailRegex).required(),
                    password: Joi.string().pattern(passwordRegex).required(),
                }),
            },
            auth:false,
        },
    },

    {
        method: "POST",
        path: "/login",
        handler: UserOnboardingController.login,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().pattern(emailRegex).required(),
                    password: Joi.string().pattern(passwordRegex).required(),
                }),
            },
            auth:false,
        },
    },

    {
        method: "POST",
        path: "/forgot-password",
        handler: UserOnboardingController.forgot_password,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().pattern(emailRegex).required(),
                }),
            },
            auth:false,
        },
    },

    {
        method: "POST",
        path: "/reset-password",
        handler: UserOnboardingController.reset_password,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().pattern(emailRegex).required(),
                    otp: Joi.number().required(),
                    newPassword: Joi.string().pattern(passwordRegex).required(),
                }),
            },
            auth:false,
        },
    },

    {
        method: "POST",
        path: "/logout",
        handler: UserOnboardingController.logout,
        options: {
            auth: "user",
        },
    },

];

export default onboardingRoutes;