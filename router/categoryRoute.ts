import express from "express";
import { category } from "../controller/category.controller";
import { authenticateToken } from "../middleware/auth";

const cateRouter = express.Router();

cateRouter.get("/");

cateRouter.get("/getCategory", authenticateToken, category.getCategory);

export { cateRouter };