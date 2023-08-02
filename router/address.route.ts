import express from "express";
import { address } from "../controller/address.controller";
import { authenticateToken } from "../middleware/auth";
import { addressValidation } from "../middleware/validation";
const addressRouter = express.Router();

addressRouter.get("/");
addressRouter.post("/addAddress", addressValidation, authenticateToken, address.addAddress);

export { addressRouter }