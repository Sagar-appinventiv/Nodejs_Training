import { Request, ResponseToolkit } from '@hapi/hapi';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { Sessions } from "../middlewares/session.middleware";
import { Redis } from '../middlewares/redis.middleware';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import { UserE } from "../entities/user.entity";

export class UserOnboardingService {

    /***************************************************/
    /******************** Signup API *******************/
    /***************************************************/
    static async signup_service(payload: any) {

        const existingUser = await UserE.ifEmailExists(payload.email);
        if (existingUser) {
            throw new Error("!!! An account with this email already exists !!!");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(payload.password, salt);
        payload.password = hashedPassword;
        const newUser = await UserE.createUser(payload);

        console.log(newUser);
        await Redis.maintain_redisSession(newUser);

        // const accountSid = process.env.TWILIO_ACCOUNT_SID;
        // const authToken = process.env.TWILIO_AUTH_TOKEN;
        // const client = require('twilio')(accountSid, authToken);

        // client.messages
        //     .create({
        //         body: `Congratulations, ${payload.fullName} you have successfully registered to SoulSync with email: ${payload.email}`,
        //         from: process.env.TWILIO_MOBILENO,
        //         to: payload.mobileNo
        //     })
        //     .then((message: { sid: any; }) => console.log(message.sid))
        //     .done();
    }

    /***************************************************/
    /******************** Login API ********************/
    /***************************************************/
    static async login_service(payload: any) {
        const user = await UserE.ifEmailExists(payload.email);
        if (!user) {
            throw new Error('!!! User not found !!!');
        }

        const hashedPassword = user.password;

        if (!(await bcrypt.compare(payload.password, hashedPassword))) {
            throw new Error('!!! Incorrect Password !!!');
        }
       

        await Redis.maintain_redisSession(user);
        await Sessions.maintain_session(user);

    }

    /***************************************************/
    /******************** Logout API *******************/
    /***************************************************/
    static async logout_service(){

    }
}