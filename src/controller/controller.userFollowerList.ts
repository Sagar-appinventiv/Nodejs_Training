import { User } from "../models/schema";
import { Follower } from "../models/followers";
import { Request, Response } from 'express';

export const userFollowerList = async( req:Request, res:Response )=>{
const userId = parseInt(req.params.id);
const page = parseInt(req.query.page as string,10) || 1;// Current page, defaulting to 1
const limit = parseInt(req.query.limit as string, 10) || 10;// Number of followers per page, defaulting to 10

  try {
    const { count, rows } = await Follower.findAndCountAll({
      where: { userId },
      include: [{ model: User, as: 'follower' }],
      limit,
      offset: (page - 1) * limit,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({page,totalPages,followers: rows.map((follower) => follower.follower)});
}catch(error){
    res.status(500).json({statusCode:500, message:'Failed to fetch Followers list !!'});
}
};