import { User } from "../models/schema";
import { Request, Response } from 'express';

export const getAllUsers = async(req:Request, res:Response)=>{
try{
    const users = await User.findAll();
    res.status(200).json(users);
}catch(error)
{
    res.status(500).json("Error !!!");
}
};