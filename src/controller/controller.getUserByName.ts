import { Op } from "sequelize";
import { User } from "../models/schema";
import { Request, Response } from 'express';

export const getUserByName = async(req:Request, res:Response)=>{
    const username = req.query.username as string;

    try{
        const users = await User.findAll({
            where: {username:{
            [Op.iLike]:`%${username}%`,
            },},
        });
        res.status(200).json(users);
    }catch(error){
        res.status(500).json('Failed to search User')
    }
};