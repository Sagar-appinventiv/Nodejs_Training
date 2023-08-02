import { product } from "../controller/product.controller";
import express from "express";
const productRouter = express.Router();
import { authenticateToken } from "../middleware/auth";
import { productValidator } from "../middleware/validation";

productRouter.get("/");
productRouter.post("/addProduct", productValidator, authenticateToken, product.addProduct);
productRouter.get("/getProduct", authenticateToken, product.getProduct);
productRouter.get("/getProduct/:pId", authenticateToken, product.getProduct);
productRouter.post("/addBid/:pid", authenticateToken, product.addbid);

export { productRouter }