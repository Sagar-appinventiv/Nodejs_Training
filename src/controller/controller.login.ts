import { User } from "../models/schema";
import { Request, Response } from 'express';

export const loginUser = async(req: Request, res: Response)=> {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ where : { email }});
        if(!user) {
            return res.status(404).json('User not found !!');
        }
        const isValidPass = await user.validatePassword(password);
        if(!isValidPass)
        {
            return res.status(401).json('Invalid Password');
        }
            const token = user.generateJWT();
            res.status(200).json({ user, token });
    }catch(error){
        res.status(500).json({ statusCode:500, message:'Error Logging In!!' });
    }
};
