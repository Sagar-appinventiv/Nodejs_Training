import express from "express";
import { image } from "../controller/image.controller";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../middleware/multer.image";
const imageRouter = express.Router();

imageRouter.get("/");
imageRouter.post("/addImage/:pid", authenticateToken, upload.array('images', 5), image.addimages);

export { imageRouter };