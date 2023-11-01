import { Request, ResponseToolkit } from '@hapi/hapi';
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import bcrypt from 'bcrypt';
import { Sessions } from "../middlewares/session.middleware";
import { Redis } from '../middlewares/redis.middleware';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import { UserE } from "../entities/user.entity";
import { UserOnboardingService } from '../services/onboarding.service';
import { createApiLogger } from 'logging-colorify';
import { User } from '../models/user.model';
import path from 'path';

dotenv.config();

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URL
});

async function getGoogleSignInUrl() {
    const authUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
    });
    return authUrl;
}
export class UserOnboardingController {

    /***************************************************/
    /******************** Signup API *******************/
    /***************************************************/
    static async signup(request: Request, h: ResponseToolkit) {
        try {
            let stime = new Date();
            const payload = request.payload as {
                fullName: string;
                email: string;
                password: string;
                mobileNo: string
            }
            createApiLogger(request, stime);
            const user = await UserOnboardingService.signup_service(payload);
            // return h.redirect('/');
            return h.response({ status: '------- SignedUp successfully -------' }).code(201);
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
            const Stime = new Date();
            const payload = request.payload as {
                email: string;
                password: string;
            };

            await UserOnboardingService.login_service(payload);
            await createApiLogger(request, Stime);
            const token = jwt.sign({ email: payload.email }, process.env.SECRET_KEY!, { expiresIn: '2d' });
            console.log(token);
            h.state('token', token, {
                isHttpOnly: true
            });
            return h.response({ status: '------- Logged in successfully -------' });
            // return h.view('message')

        } catch (error: any) {
            return h.response({ status: error.message }).code(500);
        }
    }

    /***************************************************/
    /******************** Logout API *******************/
    /***************************************************/
    static async logout(request: Request, user: any, h: ResponseToolkit) {
        try {
            const isUser = await UserE.ifEmailExists(user.email);

            if (!isUser) {
                return h.response({ message: '!!! User not found !!!' }).code(404);
            }

            const logoutSuccessful = await Redis.logout_redisSession(isUser);
            if (logoutSuccessful) {
                await Sessions.update_session(isUser.id);
                h.unstate('token');
                // return h.response({ message: '------- User Logout Successfully -------' }).code(200);

                // return h.view('login');
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
            const user = await UserE.ifEmailExists(email);
            if (!user) {
                return h.response({ message: '!!! Email not found !!!' }).code(404);
            }

            const template = fs.readFileSync('/home/admin186/Documents/Dating_App_Project/modules/view/otp.template.html', 'utf-8');
            const OTP: any = Math.floor(1000 + Math.random() * 9000);
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
            https://meet.google.com/cwd-ebmr-hxa?pli=1https://meet.google.chttps://meet.google.com/cwd-ebmr-hxa?pli=1https://meet.google.com/cwd-ebmr-hxa?pli=1https://meet.google.com/cwd-ebmr-hxa?pli=1om/cwd-ebmr-hxa?pli=1
            await transporter.sendMail(mailOptions);

            // console.log('Email sent: ' + info.response);
            // return h.response({ message: '------- Password reset OTP sent to email -------' }).code(200);
            return h.redirect('/resetPass');

        } catch (error) {
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
            const user: any = await UserE.ifEmailExists(email);
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

    /***************************************************/
    /******************* Google SignIn *****************/
    /***************************************************/

    static async handleGoogleSignIn(request: Request, h: ResponseToolkit) {
        try {
            console.log("Query parameters:", request.query);
            const tokenId:any = request.query.code as string;
            console.log("tokenId:", tokenId);        
            if (!tokenId) {
            return h.response({ message: 'Invalid or missing token' }).code(400);
        }
        const { tokens } = await client.getToken(tokenId);
        console.log("Tokens: ", tokens);
            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token as string,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            if (payload) {
                const user = await User.create({
                    fullName: payload.name,
                    password: '00000',
                    email: payload.email
                })
                client.revokeToken(tokens.access_token as string);

                if (user) {
                    let token = jwt.sign({ email: user.email, id: user.id }, process.env.SECRET_KEY!, { expiresIn: '1h' });

                    return h.response({ message: 'SignUp successfull', User: user, token }).code(201);
                } else {
                    return h.response({ message: "Signup can't happen" }).code(500);
                }
            } else {
                return h.response({ message: 'Invalid Google payload' }).code(400);
            }
        } catch (error) {
            console.error('Google Signup Error:', error);
            return h.response({ message: 'Error signing up with Google' }).code(500);
        }
    }

    static async googleSignIn(request: Request, h: ResponseToolkit) {
        try {
            const htmlPath = fs.readFileSync(
            path.join(process.cwd(), 'view', 'googleSignIn.html'), 'utf-8');
            const url = await getGoogleSignInUrl();
            console.log(url)
            const data = htmlPath.replace('{{name}}', url);
            return h.response(data);
        } catch (error) {
            console.error('Google Signup Error:', error);
            return h.response({ message: 'Error signing up with Google' }).code(500);
        }
    }
}