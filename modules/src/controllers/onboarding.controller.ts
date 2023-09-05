import { User } from "../models/user.model";
import { Request, ResponseToolkit } from '@hapi/hapi';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { Sessions } from "../middlewares/session.middleware";
import { Redis } from '../middlewares/redis.middleware';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export class UserOnboardingController {

    /***************************************************/
    /******************** Signup API *******************/
    /***************************************************/
    static async signup(request: Request, h: ResponseToolkit) {
        try {
            // await validateSignup.payload.validateAsync(request.payload, h);
            const { fullName, email, password } = request.payload as {
                fullName: string;
                email: string;
                password: string;
            }
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return h.response({ status: '!!! Email already exists !!!' }).code(409);
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                fullName,
                email,
                password: hashedPassword
            });

            console.log(newUser);
            await Redis.maintain_redisSession(newUser);
            // return h.response({ status: '------- SignedUp successfully -------' }).code(201);
            return h.redirect('/')
        } catch (error) {
            console.error('!!! Server Error:', error);
            return h.response({ status: '!!! Server error !!!' }).code(500);
        }
    }

    /***************************************************/
    /******************** Login API ********************/
    /***************************************************/
    static async login(request: Request, h: ResponseToolkit) {
        try {
            // validateLogin.payload.validateAsync(request.payload, h);

            const { email, password } = request.payload as {
                email: string;
                password: string;
            };

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return h.response({ status: '!!! User not found !!!' }).code(404);
            }

            const hashedPassword = user.password;

            if (!(await bcrypt.compare(password, hashedPassword))) {
                return h.response({ status: '!!! Incorrect Password !!!' }).code(401);
            }

            const token = jwt.sign({ email }, process.env.SECRET_KEY!, { expiresIn: '2d' });
            console.log(token);

            await Redis.maintain_redisSession(user);
            await Sessions.maintain_session(user);
            h.state('token', token, {
                isHttpOnly: true
            });
            // return h.response({ status: '------- Logged in successfully -------' });
            return h.view('message')

        } catch (error) {
            return h.response({ status: '!!! Server error !!!' }).code(500);
        }
    }

    /***************************************************/
    /******************** Logout API *******************/
    /***************************************************/
    static async logout(request: Request, user: any, h: ResponseToolkit) {
        try {
            const isUser = await User.findOne({ where: { email: user.email } });

            if (!isUser) {
                return h.response({ message: '!!! User not found !!!' }).code(404);
            }

            const logoutSuccessful = await Redis.logout_redisSession(isUser);
            if (logoutSuccessful) {
                await Sessions.update_session(isUser.id);
                // return h.response({ message: '------- User Logout Successfully -------' }).code(200);
                return h.view('login');
            } else {
                return h.response({ message: '!!! Session not found !!!' }).code(404);
            }
        } catch (error) {
            console.log(error);
            return h.response({ message: '!!! Server error !!!' }).code(500);
        }
    }

    /***************************************************/
    /*************** Forgot Password API ***************/
    /***************************************************/
    static async forgot_password(request: Request, h: ResponseToolkit) {
        try {
            const { email } = request.payload as { email: string };
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return h.response({ message: '!!! Email not found !!!' }).code(404);
            }

            const template = fs.readFileSync('/home/admin186/Documents/Dating_App_Project/modules/view/otp.template.html', 'utf-8');
            const OTP:any = Math.floor(1000 + Math.random() * 9000);
            await Redis.save_otp(email, OTP);

            console.log(OTP);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'Password Reset Request',
                html: template.replace("{{ fullName }}", user.fullName).replace("{{ OTP }}", OTP),
            };

        await transporter.sendMail(mailOptions);

        // console.log('Email sent: ' + info.response);
        // return h.response({ message: '------- Password reset OTP sent to email -------' }).code(200);
        return h.redirect('/resetPass');

    } catch(error) {
        console.log(error);
        return h.response({ message: '!!! Server Error !!!' }).code(500);
    }
}

    /***************************************************/
    /**************** Reset Password API ***************/
    /***************************************************/
    static async reset_password(request: Request, h: ResponseToolkit) {
    try {
        const { email, otp, newPassword } = request.payload as {
            email: string;
            otp: string;
            newPassword: string;
        };
        const user: any = await User.findOne({ where: { email } });
        if (!user) {
            return h.response({ message: '!!! Invalid User !!!' }).code(400);
        }

        const userOTP = await Redis.get_otp(email);
        if (!userOTP || userOTP !== otp) {
            return h.response({ error: '!!! Invalid OTP !!!' }).code(401);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;

        await user.save();
        return h.response({ message: '------- Password reset successfully -------' }).code(200);
    } catch (error) {
        return h.response({ message: '!!! Server error !!!' }).code(500);
    }
}
}