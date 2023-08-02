"use strict";
// import { User } from "../models/user.model";
// import jwt from "jsonwebtoken";
// import { RedisSession } from "../middleware/redis.session"; // Updated import
// import { createClient } from "redis";
// import { Session } from "../models/session.model";
// import { Sessions } from "./session.controller";
// import { Auth } from "../middleware/decode";
// import dotenv from 'dotenv';
// import bcrypt from 'bcrypt';
// import nodemailer from "nodemailer";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPassword = exports.Logout = exports.LoginUser = exports.SignUp = void 0;
// dotenv.config();
// const SECRET_KEY = process.env.SECRET_KEY;
// const redisClient = createClient()
// export class signUp {
//     static async userLogin(req: any, res: any) {
//         const details = req.body;
//         // console.log(details);
//         try {
//             const user = await User.findOne({ where: { email: details.email } });
//             // console.log(user);
//             if (user) {
//                 res.status(409).json({ message: "User already exist" });
//             } else {
//                 const salt = await bcrypt.genSalt(10);
//                 const hashPassword = await bcrypt.hash(details.password, salt);
//                 // console.log(hashPassword);
//                 const newUser = await User.create({
//                     email: details.email,
//                     name: details.name,
//                     password: hashPassword,
//                     phone_number: details.phone_number,
//                     status: details.status,
//                     DOB: details.DOB
//                 });
//                 // console.log(newUser);
//                 res.status(201).json({ message: "User registered successfully" });
//             }
//             // }
//         } catch (error) {
//             res.status(500).json({ message: "Server Error" });
//         }
//     }
// }
// export class LoginUser {
//     static async userLogin(req: any, res: any) {
//         const redisClient = createClient();
//         redisClient.on('error', err => console.log('Redis client error', err));
//         await redisClient.connect();
//         const detail = req.body;
//         try {
//             const device = req.headers.device;
//             console.log(device);
//             const user = await User.findOne({ where: { email: detail.email } });
//             console.log(user);
//             if (user) {
//                 const userSession = await Session.findOne({ where: { user_id: user.id } });
//                 console.log(userSession);
//                 if (!userSession || !userSession.status) {
//                     const hash = user.password;
//                     if (bcrypt.compare(detail.password, hash)) {
//                         const token = jwt.sign(detail.email, process.env.SECRET_KEY);
//                         console.log(token);
//                         await Sessions.maintain_session(req, res, device, user, userSession);
//                         console.log(userSession);
//                         await Redis.maintain_session_redis(redisClient, user, device);
//                         res.status(201).json({ message: "login successfully", user: user, token });
//                     }
//                     else {
//                         res.status(404).json({ message: "password is incorrect" });
//                     }
//                 }
//                 else {
//                     res.status(404).json({ message: "User is already active" })
//                 }
//             }
//             else {
//                 res.status(404).json({ status: "user not found" });
//             }
//         } catch (error) {
//             res.status(500).json({ status: "Server Error" });
//             console.log(error);
//         }
//     }
// }
// export class Logout {
//     static async logout_user(req: any, res: any) {
//         const redisClient = createClient();
//         redisClient.on('error', err => console.log('Redis client error', err));
//         await redisClient.connect();
//         try {
//             const userToken = await Auth.verify_token(req);
//             const user = await User.findOne({ where: { email: userToken } });
//             console.log(user);
//             if (user) {
//                 const id = user.id;
//                 console.log(id);
//                 const userSession = await Session.findOne({ where: { user_id: id } });
//                 console.log(userSession);
//                 if (user) {
//                     if (userSession.status) {
//                         await Redis.logout_session_redis(redisClient, user);
//                         const updatedUserSession = await Session.update({ status: !userSession.status },
//                             {
//                                 where:
//                                     { id: userSession.id }
//                             });
//                         console.log(updatedUserSession);
//                         res.status(201).json({ message: "User logOut Successfully" });
//                     }
//                 }
//             }
//         }
//         catch (err) {
//             res.status(500).json({ message: "Server Error" });
//         }
//     }
// }
// export class forgotPassword {
//     static async forgot_password(req: any, res: any) {
//         try {
//             const { email } = req.body;
//             console.log(req.body);
//             const user = await User.findOne({ where: { email: email } });
//             if (!user) {
//                 return res.status(400).json({ message: 'Email not found' });
//             }
//             let OTP = Math.floor(1000 + Math.random() * 9000);
//             Redis.save_otp(email, OTP);
//             const transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 host: 'smtp.gmail.com',
//                 port: 465,
//                 secure: false,
//                 auth: {
//                     user: process.env.EMAIL_ADDRESS,
//                     pass: process.env.EMAIL_PASSWORD,
//                 },
//             });
//             const mailOptions = {
//                 from: process.env.EMAIL_ADDRESS,
//                 to: email,
//                 subject: 'Password Reset Request',
//                 text: ` Please click on the following link, or paste this into your browser to complete the process:\n\n
//                         ${process.env.CLIENT_URL}/RESET PASSWORD OTP: ${OTP}\n\n
//                         If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//             };
//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log(error);
//                     return res.status(500).json({ message: 'Error sending email' });
//                 } else {
//                     console.log('Email sent: ' + info.response);
//                     return res.status(200).json({ message: 'Password reset link sent to email' });
//                 }
//             });
//         }
//         catch (error) {
//             console.log(error);
//             res.status(500).json({ message: 'Server error' });
//         }
//     }
//     static async reset_password(req: any, res: any) {
//         try {
//             const { email, otp, newPassword } = req.body;
//             const user = await Auth.find_user(email);;
//             if (!user) {
//                 return res.status(400).json({ message: 'Invalid User' });
//             }
//             const userOTP = await RedisSession.get_otp(email);
//             console.log(userOTP);
//             if (!userOTP || userOTP !== otp) {
//                 return res.status(401).json({ error: 'Invalid OTP' });
//             }
//             console.log(user.password);
//             user.password = await Auth.generate_hash_pass(newPassword);
//             console.log(user.password);
//             await user.save();
//             return res.status(200).json({ message: 'Password reset successful' });
//         }
//         catch (error) {
//             console.log(error);
//             res.status(500).json({ message: 'Server error' });
//         }
//     }
// }
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_session_1 = require("../middleware/redis.session");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const session_controller_1 = require("./session.controller");
const session_model_1 = require("../models/session.model");
const decode_1 = require("../middleware/decode");
const SECRET_KEY = process.env.SECRET_KEY;
class SignUp {
    static signUpUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = req.body;
            try {
                const user = yield user_model_1.User.findOne({ where: { email: details.email } });
                if (user) {
                    res.status(409).json({ message: "User already exists" });
                }
                else {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashPassword = yield bcrypt_1.default.hash(details.password, salt);
                    const newUser = yield user_model_1.User.create({
                        email: details.email,
                        name: details.name,
                        password: hashPassword,
                        phone_number: details.phone_number,
                        status: details.status,
                        DOB: details.DOB
                    });
                    res.status(201).json({ message: "User registered successfully" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
}
exports.SignUp = SignUp;
class LoginUser {
    static userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = req.body;
            try {
                const device = req.headers.device;
                const user = yield user_model_1.User.findOne({ where: { email: detail.email } });
                if (user) {
                    const userSession = yield session_model_1.Session.findOne({ where: { user_id: user.id } });
                    if (!userSession || !userSession.status) {
                        const hash = user.password;
                        const passwordMatch = yield bcrypt_1.default.compare(detail.password, hash);
                        if (passwordMatch) {
                            const token = jsonwebtoken_1.default.sign(detail.email, process.env.SECRET_KEY);
                            yield session_controller_1.Sessions.maintain_session(req, res, device, user, userSession);
                            yield redis_session_1.RedisSession.maintainSession(user, device); // Using RedisSession class to maintain session
                            res.status(201).json({ message: "Login successfully", user: user, token });
                        }
                        else {
                            res.status(404).json({ message: "Password is incorrect" });
                        }
                    }
                    else {
                        res.status(404).json({ message: "User is already active" });
                    }
                }
                else {
                    res.status(404).json({ message: "User not found" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
}
exports.LoginUser = LoginUser;
class Logout {
    static logoutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userToken = yield decode_1.Auth.verify_token(req);
                const user = yield user_model_1.User.findOne({ where: { email: userToken } });
                if (user) {
                    const id = user.id;
                    const userSession = yield session_model_1.Session.findOne({ where: { user_id: id } });
                    if (userSession && userSession.status) {
                        yield redis_session_1.RedisSession.logoutSession(user); // Using RedisSession class to logout session
                        const updatedUserSession = yield session_model_1.Session.update({ status: !userSession.status }, {
                            where: { id: userSession.id }
                        });
                        console.log(updatedUserSession);
                        res.status(201).json({ message: "User logOut successfully" });
                    }
                    else {
                        res.status(404).json({ message: "User session not found" });
                    }
                }
                else {
                    res.status(404).json({ message: "User not found" });
                }
            }
            catch (err) {
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
}
exports.Logout = Logout;
class ForgotPassword {
    static forgot_password(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                console.log(req.body);
                const user = yield user_model_1.User.findOne({ where: { email: email } });
                if (!user) {
                    return res.status(400).json({ message: 'Email not found' });
                }
                let OTP = Math.floor(1000 + Math.random() * 9000);
                redis_session_1.RedisSession.saveOTP(email, OTP); // Using RedisSession class to save OTP
                const transporter = nodemailer_1.default.createTransport({
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
                    to: email,
                    subject: 'Password Reset Request',
                    text: ` Please click on the following link, or paste this into your browser to complete the process:\n\n
                        ${process.env.CLIENT_URL}/RESET PASSWORD OTP: ${OTP}\n\n
                        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Error sending email' });
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                        return res.status(200).json({ message: 'Password reset link sent to email' });
                    }
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static reset_password(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, newPassword } = req.body;
                const user = yield decode_1.Auth.find_user(email);
                if (!user) {
                    return res.status(400).json({ message: 'Invalid User' });
                }
                const userOTP = yield redis_session_1.RedisSession.getOTP(email); // Using RedisSession class to get OTP
                console.log(userOTP);
                if (!userOTP || userOTP !== otp) {
                    return res.status(401).json({ error: 'Invalid OTP' });
                }
                console.log(user.password);
                user.password = yield decode_1.Auth.generate_hash_pass(newPassword);
                console.log(user.password);
                yield user.save();
                return res.status(200).json({ message: 'Password reset successful' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.ForgotPassword = ForgotPassword;
//# sourceMappingURL=onboarding.controller.js.map