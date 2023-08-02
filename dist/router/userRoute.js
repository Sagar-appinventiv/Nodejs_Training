"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const onboarding_controller_1 = require("../controller/onboarding.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.get("/");
userRouter.post("/signup", validation_1.userValidate, onboarding_controller_1.signUp.userLogin);
userRouter.post("/login", validation_1.loginValidation, onboarding_controller_1.LoginUser.userLogin);
userRouter.get("/logout", auth_1.authenticateToken, onboarding_controller_1.Logout.logout_user);
userRouter.post('/forgot_pass', onboarding_controller_1.forgotPassword.forgot_password);
userRouter.post('/reset_pass', onboarding_controller_1.forgotPassword.reset_password);
//# sourceMappingURL=userRoute.js.map