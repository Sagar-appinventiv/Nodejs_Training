"use strict";
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
exports.forgotPassword = exports.Logout = exports.LoginUser = exports.signUp = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_session_1 = require("../middleware/redis.session");
const redis_1 = require("redis");
const session_model_1 = require("../models/session.model");
const session_controller_1 = require("./session.controller");
const decode_1 = require("../middleware/decode");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
class signUp {
    static userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = req.body;
            // console.log(details);
            try {
                const user = yield user_model_1.User.findOne({ where: { email: details.email } });
                // console.log(user);
                if (user) {
                    res.status(409).json({ message: "User already exist" });
                }
                else {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashPassword = yield bcrypt_1.default.hash(details.password, salt);
                    // console.log(hashPassword);
                    const newUser = yield user_model_1.User.create({
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
                // }
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
            }
        });
    }
}
exports.signUp = signUp;
class LoginUser {
    static userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisClient = (0, redis_1.createClient)();
            redisClient.on('error', err => console.log('Redis client error', err));
            yield redisClient.connect();
            const detail = req.body;
            try {
                const device = req.headers.device;
                console.log(device);
                const user = yield user_model_1.User.findOne({ where: { email: detail.email } });
                console.log(user);
                if (user) {
                    const userSession = yield session_model_1.Session.findOne({ where: { user_id: user.id } });
                    console.log(userSession);
                    if (!userSession || !userSession.status) {
                        const hash = user.password;
                        if (bcrypt_1.default.compare(detail.password, hash)) {
                            const token = jsonwebtoken_1.default.sign(detail.email, process.env.SECRET_KEY);
                            console.log(token);
                            yield session_controller_1.Sessions.maintain_session(req, res, device, user, userSession);
                            console.log(userSession);
                            yield redis_session_1.Redis.maintain_session_redis(redisClient, user, device);
                            res.status(201).json({ message: "login successfully", user: user, token });
                        }
                        else {
                            res.status(404).json({ message: "password is incorrect" });
                        }
                    }
                    else {
                        res.status(404).json({ message: "User is already active" });
                    }
                }
                else {
                    res.status(404).json({ status: "user not found" });
                }
            }
            catch (error) {
                res.status(500).json({ status: "Server Error" });
                console.log(error);
            }
        });
    }
}
exports.LoginUser = LoginUser;
class Logout {
    static logout_user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisClient = (0, redis_1.createClient)();
            redisClient.on('error', err => console.log('Redis client error', err));
            yield redisClient.connect();
            try {
                const userToken = yield decode_1.Auth.verify_token(req);
                const user = yield user_model_1.User.findOne({ where: { email: userToken } });
                console.log(user);
                if (user) {
                    const id = user.id;
                    console.log(id);
                    const userSession = yield session_model_1.Session.findOne({ where: { user_id: id } });
                    console.log(userSession);
                    if (user) {
                        if (userSession.status) {
                            yield redis_session_1.Redis.logout_session_redis(redisClient, user);
                            const updatedUserSession = yield session_model_1.Session.update({ status: !userSession.status }, {
                                where: { id: userSession.id }
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
        });
    }
}
exports.Logout = Logout;
class forgotPassword {
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
                redis_session_1.Redis.save_otp(email, OTP);
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
                    to: 'sagarsky26@gmail.com',
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
                ;
                if (!user) {
                    return res.status(400).json({ message: 'Invalid User' });
                }
                const userOTP = yield redis_session_1.Redis.get_otp(email);
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
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=onboarding.controller.js.map