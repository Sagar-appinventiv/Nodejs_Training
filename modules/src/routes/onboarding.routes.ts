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
            tags: ['api','User onboading APIs'],
            description: 'User SignUp API',
            notes: 'This API allows users to sign up',
            validate: {
                payload : Joi.object({
                    fullName: Joi.string().required(),
                    email:Joi.string().pattern(emailRegex).required(),
                    password: Joi.string().pattern(passwordRegex).required(),
                }),
                options: {
                    allowUnknown:true,
                    security: [{ apiKey:[] }]
                }
            },
        
            auth:false,
        },
    },

    {
        method: "POST",
        path: "/login",
        handler: UserOnboardingController.login,
        options: {
            tags: ['api','User onboading APIs'],
            description: 'Login API',
            notes
            : 'This API allows users to Login ',
            validate: {
                payload: Joi.object({
                    email: Joi.string().pattern(emailRegex).required(),
                    password: Joi.string().pattern(passwordRegex).required(),
                }),
                options: {
                    allowUnknown:true,
                    security: [{ apiKey:[] }]
                }
            },
            auth:false,
        },
    },

    {
        method: "POST",
        path: "/forgot-password",
        handler: UserOnboardingController.forgot_password,
        options: {
            tags: ['api','User onboading APIs'],
            description: 'Forgot Password API',
            notes: 'This API will send an OTP to user email',
            validate: {
                payload: Joi.object({
                    email: Joi.string().pattern(emailRegex).required(),
                }),
                options: {
                    allowUnknown:true,
                    security: [{ apiKey:[] }]
                }
            },
            auth:false,
        },
    },

    {
        method: "POST",
        path: "/reset-password",
        handler: UserOnboardingController.reset_password,
        options: {
            tags: ['api','User onboading APIs'],
            description: 'Reset Password API',
            notes: 'This API allows users to reset their password',
            validate: {
                payload: Joi.object({
                    email: Joi.string().pattern(emailRegex).required(),
                    otp: Joi.number().required(),
                    newPassword: Joi.string().pattern(passwordRegex).required(),
                }),
                options: {
                    allowUnknown:true,
                    security: [{ apiKey:[] }]
                }
            },
            auth:false,
        },
    },

    {
        method: "POST",
        path: "/logout",
        options: {
            tags: ['api','User onboading APIs'],
            description: 'LogOut API',
            validate:{
                options: {
                    allowUnknown:true,
                    security: [{ apiKey:[] }]
                }
            },
            auth: "user",
        },
        handler: (request:any,h) => {
            const {user} = request;
            return UserOnboardingController.logout(request,user,h);
        }
    },

];

export default onboardingRoutes;