import express from "express";
import { LoginUser, Logout, signUp, forgotPassword } from "../controller/onboarding.controller";
import { authenticateToken } from "../middleware/auth";
import { loginValidation, userValidate } from "../middleware/validation";
const userRouter = express.Router();

userRouter.get("/");

userRouter.post("/signup", userValidate, signUp.userLogin);
userRouter.post("/login", loginValidation, LoginUser.userLogin);
userRouter.get("/logout", authenticateToken, Logout.logout_user);
userRouter.post('/forgot_pass', forgotPassword.forgot_password);
userRouter.post('/reset_pass', forgotPassword.reset_password);

export { userRouter }; 