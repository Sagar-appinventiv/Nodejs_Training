import express from "express";
import { LoginUser, Logout, signUp, forgotPassword } from "../controller/onboarding.controller";
import { authenticateToken } from "../middleware/auth";

const userRouter = express.Router();  

userRouter.get("/");

userRouter.post("/signup",signUp.userLogin);  
userRouter.post("/login",LoginUser.userLogin);
userRouter.get("/logout",authenticateToken,Logout.logout_user);
userRouter.post('/forgot_pass', forgotPassword.forgot_password);
userRouter.post('/reset_pass',forgotPassword.reset_password);

export { userRouter }; 