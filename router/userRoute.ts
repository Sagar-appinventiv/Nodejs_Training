import express from "express";
import { LoginUser, Logout, SignUp, ForgotPassword } from "../controller/onboarding.controller";
import { authenticateToken } from "../middleware/auth";
import { loginValidation, userValidate } from "../middleware/validation";
const userRouter = express.Router();

userRouter.get("/");

userRouter.post("/signup", userValidate, SignUp.signUpUser);
userRouter.post("/login", loginValidation, LoginUser.userLogin);
userRouter.get("/logout", authenticateToken, Logout.logoutUser);
userRouter.post('/forgot_pass', ForgotPassword.forgot_password);
userRouter.post('/reset_pass', ForgotPassword.reset_password);

export { userRouter }; 