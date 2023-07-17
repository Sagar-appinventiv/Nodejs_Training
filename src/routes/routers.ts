import express from "express";
import { user_SignUp } from "../controller/controller.signup";
import { loginUser } from "../controller/controller.login";
import { getUserProfile, addFollower, removeFollower } from "../controller/controller.getUserByID";
import { getAllUsers } from "../controller/controller.getAllUsers";
import { getUserByName } from "../controller/controller.getUserByName";
import { userFollowerList } from "../controller/controller.userFollowerList";

const router = express.Router();

router.get('/',getAllUsers);
router.get('/:id',getUserProfile);
router.get('/:id/followersList', userFollowerList)
router.post('/signup', user_SignUp);
router.post('/login',loginUser);
router.post('/search',getUserByName);
router.post('/:id/followers', addFollower);
router.delete('/:id/followers', removeFollower);

export default router;