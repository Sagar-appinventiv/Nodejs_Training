import { User } from "../models/schema";
import { Request, Response }  from "express";

export const user_SignUp = async (req: Request, res: Response) => {
    try{
        const { username, email, password, age } = req.body;
        const user = new User({ username, email, password, age });
        const encryptedPass = await user.generatePasswordHash();
        user.password = encryptedPass;
        await user.save();
        const token = user.generateJWT();
        res.status(201).json({ user, token });
        }
        catch(error)
        {
        res.status(500).json({ statusCode:500, message:'User Already Exists, Please Check Your Details and Try Again!!' });
        }
};