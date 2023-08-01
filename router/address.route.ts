import express from "express";
import { address } from "../controller/address.controller";
const addressRouter = express.Router();

addressRouter.get("/");
addressRouter.post("/addAddress",address.addAddress);

export {addressRouter}