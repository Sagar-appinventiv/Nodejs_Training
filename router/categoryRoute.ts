import express from "express";
import { category } from "../controller/category.controller";

const cateRouter = express.Router();

cateRouter.get("/");

cateRouter.get("/getCategory",category.getCategory);
// cateRouter.get("/getSubCategory",category.getSubCategory);
// cateRouter.get("/subSubCategory",category.getSubSubCategory);

export{cateRouter};