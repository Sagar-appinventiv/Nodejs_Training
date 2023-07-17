// import { User } from "../models/schema";
// import { Request, Response } from 'express';

// export const getUserByID = async(req: Request, res: Response)=>{
//     try{
//         const {id} = req.params;
//         const user = await User.findByPk(id);

//         if(!user){
//             res.status(404).json('User Not Found, Please Enter Correct ID');
//         }
//         else{
//             res.status(200).json(user);
//         }
//     }catch(error){
//         res.status(500).json({statusCode:500, message:'Server Error'});
//     }
// };
// export async function addFollower(req: Request, res: Response): Promise<void> {
//   const userId = parseInt(req.params.id, 10);
//   const followerId = parseInt(req.body.followerId, 10);

//   try {
//     const follower = await Follower.create({ userId, followerId });
//     res.json(follower);
//   } catch (error) {
//     res.status(500).json('Failed to add follower');
//   }
// }

// export async function removeFollower(req: Request, res: Response): Promise<void> {
//   const userId = parseInt(req.params.id, 10);
//   const followerId = parseInt(req.body.followerId, 10);

//   try {
//     const deletedCount = await Follower.destroy({ where: { userId, followerId } });
//     res.json({ deletedCount });
//   } catch (error) {
//     res.status(500).json({'Failed to remove follower'});
//   }
// } 


import { Request, Response } from 'express';
import { User } from '../models/schema';
import { Follower } from "../models/followers";

export const getUserProfile = async(req: Request, res: Response)=>{
  const userId = parseInt(req.params.id);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
        res.status(404).json('User not found');
    } else {
        const followerCount = await Follower.count({ where: { userId } });
        const followingCount = await Follower.count({ where: { followerId: userId } });
        res.json({id: user.id, email: user.email, followerCount, followingCount});
    }
  } catch (error) {
    res.status(500).json('Failed to fetch user profile');
  }
}

export const addFollower = async(req: Request, res: Response)=>{
  const userId = parseInt(req.params.id);
  const followerId = parseInt(req.body.followerId);

  try {
    const follower = await Follower.create({ userId, followerId });
    res.json(follower);
  } catch (error) {
    res.status(500).json('Failed to add follower');
  }
}

export const removeFollower = async(req: Request, res: Response)=>{
  const userId = parseInt(req.params.id);
  const followerId = parseInt(req.body.followerId);

  try {
    const deletedCount = await Follower.destroy({ where: { userId, followerId } });
    res.json({ deletedCount });
  } catch (error) {
    res.status(500).json('Failed to remove follower');
  }
}
