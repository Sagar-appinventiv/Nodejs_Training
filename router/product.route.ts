import { product } from "../controller/product.controller";
import express from "express";
const productRouter = express.Router();

productRouter.get("/");
productRouter.post("/addProduct",product.addProduct);
productRouter.get("/getProduct",product.getProduct);
productRouter.get("/getProduct/:pId",product.getProduct);
productRouter.post("/addBid/:pid",product.addbid);
export {productRouter}