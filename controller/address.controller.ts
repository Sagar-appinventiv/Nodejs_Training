import { Address } from "../models/address.model";

export class address{
    static async addAddress(req:any,res:any){
        const detail =req.body;
        try {
            
            await Address.create(detail);
            res.status(201).json({ message: "Address registered successfully" }); 
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
            console.log(error);
        }
    }
}