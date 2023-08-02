import express, { Router } from "express";
import { userRouter } from "./userRoute";
import { cateRouter } from "./categoryRoute";
import { productRouter } from "./product.route";
import { addressRouter } from "./address.route";
import { imageRouter } from "./image.route";

class AppRouter {
    public router: Router;
    constructor() {
        this.router = express.Router();
    }

    loadAppRoutes() {
        this.router.use('/', userRouter);
        this.router.use('/', cateRouter);
        this.router.use('/', productRouter);
        this.router.use('/', addressRouter);
        this.router.use('/', imageRouter);
        return this.router;
    }

}

export const appRoutes = new AppRouter();