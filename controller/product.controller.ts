import { Category } from "../models/category.model";
import { Product } from "../models/product.model";

export class product{
    static async addProduct(req:any,res:any){
        const detail =req.body;
        try {
            await Product.create(detail);
            res.status(201).json({ message: "Product registered successfully" }); 
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
            console.log(error);
        }
    }

    static async getProduct(req:any,res:any,){

        try{

            // console.log("Params:  ",  req.params);
            // console.log("Query Params:  ", req.query);
            let prod = await Product.findByPk(req.query.id)
            res.status(201).json(prod); 
        }
        catch(err){
            res.status(500).json({ message: "Server Error" });
            console.log(err);
        }
    }

    static async addbid(req:any,res:any){
        const pid = req.params.pid;
        const currentBid = req.body.currentBid;
        try {

            var product = await Product.findOne({where:{id:pid}}); 
            console.log(product)
            if(product.current_bid<currentBid){
                 product = Product.update({current_bid:currentBid},
                    {where:{
                        id:pid
                    }})
            }
            else{
                res.status(402).json({ message: "current Bid price is high" });
            }
            res.status(201).json("bid updated"); 
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
            console.log(error);
        }
    }
}