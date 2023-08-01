import { User } from "../models/user.model";
import { SingnUpschema } from "../middleware/validation";
import joi from "@hapi/joi";
import jwt from "jsonwebtoken";
import { Redis } from "../middleware/redis.session";
import { createClient } from "redis";
import { Session } from "../models/session.model";
import { Sessions } from "./session.controller";
import { Auth } from "../middleware/decode";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

// const redisClient = createClient();
// redisClient.on('error', err => console.log('Redis client error', err));
// redisClient.connect();

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export class signUp {
    static async userLogin(req: any, res: any) {
        const details = req.body;
        // console.log(details);
        try {
            const { error, value } = await SingnUpschema.validate(details);
            if (error) {
                res.status(400).json({ message: "Invalid user input" });
            } else {
                const user = await User.findOne({ where: { email: details.email } });
                // console.log(user);
                if (user) {
                    res.status(409).json({ message: "User already exist" });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(details.password, salt);
                    // console.log(hashPassword);
                    const newUser = await User.create({
                        email: details.email,
                        name: details.name,
                        password: hashPassword,
                        phone_number: details.phone_number,
                        status: details.status,
                        DOB: details.DOB
                    });
                    // console.log(newUser);
                    res.status(201).json({ message: "User registered successfully" });
                }
            }
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    }
}

export class LoginUser {
    static async userLogin(req: any, res: any) {
        const redisClient = createClient();
        redisClient.on('error', err => console.log('Redis client error', err));
        await redisClient.connect();
        const detail = req.body;
        try {
            const device = req.headers.device;
            console.log(device);
            await Auth.verify_login_details.validateAsync(detail);
            const user = await User.findOne({ where: { email: detail.email } });
            console.log(user);
            if (user) {
                const userSession = await Session.findOne({ where: { user_id: user.id } });
                console.log(userSession);
                if (!userSession || !userSession.status) {
                    const hash = user.password;
                    if (bcrypt.compare(detail.password, hash)) {
                        const token = jwt.sign(detail.email, process.env.SECRET_KEY);
                        console.log(token);
                        await Sessions.maintain_session(req, res, device, user, userSession);
                        console.log(userSession);
                        await Redis.maintain_session_redis(redisClient, user, device);
                        res.status(201).json({ message: "login successfully", user: user, token });
                    }
                    else {
                        res.status(404).json({ message: "password is incorrect" });
                    }
                }
                else {
                    res.status(404).json({ message: "User is already active" })
                }
            }
            else {
                res.status(404).json({ status: "user not found" });
            }

        } catch (error) {
            res.status(500).json({ status: "Server Error" });
            console.log(error);
        }
    }
}


export class Logout {
    static async logout_user(req: any, res: any) {
        const redisClient = createClient(); 
        redisClient.on('error', err => console.log('Redis client error', err));
        await redisClient.connect();
        try {
            const userToken = await Auth.verify_token(req);
            const user = await User.findOne({ where: { email: userToken } }); 
            console.log(user);
            if (user) {
                const id = user.id;
                console.log(id);
                const userSession = await Session.findOne({ where: { user_id: id } });
                console.log(userSession);
                if (user) {
                    if (userSession.status) {
                        await Redis.logout_session_redis(redisClient, user);

                        const updatedUserSession = await Session.update({ status: !userSession.status },
                            {
                                where:
                                    { id: userSession.id } 
                            });
                        console.log(updatedUserSession);
                        res.status(201).json({ message: "User logOut Successfully" });
                    }   
                }   
            }
        }
        catch (err) {
            res.status(500).json({ message: "Server Error" });
        }
    }

}


export class forgotPassword {
    static async forgot_password(req: any, res: any) {
        try {
            const { email } = req.body;
            console.log(req.body);
            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(400).json({ message: 'Email not found' });
            }

            let OTP = Math.floor(1000 + Math.random() * 9000);
            Redis.save_otp(email, OTP);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: false,
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: 'sagarsky26@gmail.com',
                subject: 'Password Reset Request',
                text: `Please click on the following link, or paste this into your browser to complete the process:\n\n
                        ${process.env.CLIENT_URL}/RESET PASSWORD OTP: ${OTP}`,        
                        };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).json({ message: 'Password reset link sent to email' });
                }
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async reset_password(req: any, res: any) {
        try {
            const { email, otp, newPassword } = req.body;

            const user = await Auth.find_user(email);;

            if (!user) {
                return res.status(400).json({ message: 'Invalid User' });
            }

            const userOTP = await Redis.get_otp(email);
            console.log(userOTP);
            if (!userOTP || userOTP !== otp) {
                return res.status(401).json({ error: 'Invalid OTP' });
            }

            console.log(user.password);
            user.password = await Auth.generate_hash_pass(newPassword);
            console.log(user.password);
            await user.save();

            return res.status(200).json({ message: 'Password reset successful' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

