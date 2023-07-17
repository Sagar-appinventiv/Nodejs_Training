/*****************************************************************************************/
/*************** CURRENTLY PAGINATION IS NOT WORKING NEED TO WORK ON IT ******************/
/*****************************************************************************************/ 

import { User } from "../models/schema";
import { Follower } from "../models/followers";
import { Request, Response } from 'express';

export const userFollowerList = async( req:Request, res:Response )=>{
  try{
const userId = Number(req.params.id);
const page = parseInt(req.query.page as string, 10) || 1;
const limit = parseInt(req.query.limit as string, 10);
  
    const { rows } = await Follower.findAndCountAll({
      where: { userId },
      include: [{ model: User, as: 'follower' }],
      limit,
      offset: (page - 1) * limit,
    });

    res.json({page,followers: rows.map((follower) => follower.follower)});
}catch(error){
    res.status(500).json({statusCode:500, message:'Failed to fetch Followers list !!'});
}
};