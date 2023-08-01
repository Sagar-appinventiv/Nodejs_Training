import { Image } from "../models/image.model";
import fs from "fs";

export class image {
    static async addimages(req: any, res: any) {
        try {
            console.log(req.files);
            const pid = req.params.pid;
            const files = req.files;
            const bufferDataArray = [];
            for (let file in files) {
                // console.log(files[file].path);
                const fileData = fs.readFileSync(files[file].path);
                // console.log(fileData);
                const bufferData = Buffer.from(fileData);
                bufferDataArray.push(bufferData);
                console.log(bufferData);
            }
            //console.log(req.user);
            const images = await Image.create({ image: bufferDataArray, product_id: pid });
            console.log(images);
            res.status(201).json({ message: "images registered successfully" });
        }
        catch (err) {
            res.status(500).json({ message: "Server Error" });
            console.log(err);
        }
    }
}