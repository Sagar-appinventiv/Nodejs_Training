import Joi from '@hapi/joi';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { User } from '../models/user.model';
import bcrypt from "bcrypt";
dotenv.config();


const key = process.env.SECRET_KEY;

export class Auth{

    static async verify_token(req:any) {
        const token = req.headers.authorization;
        console.log(token);
        if (token) {
            const decoded = jwt.verify(token, key);
            return decoded;
        }
        else {
            return false;
        }
    }

    static verify_login_details = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(30).required()
    });

    static async find_user(email) {
        const isUser = await User.findOne({ where: { email} });
        if (isUser) {
            return isUser;
        }
        else {
            return false;
        }
    }

    static async generate_hash_pass(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

}