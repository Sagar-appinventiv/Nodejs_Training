import { Product } from "../models/product.model";

export class product {
    static async addProduct(req: any, res: any) {
        const detail = req.body;
        try {
            await Product.create(detail);
            res.status(201).json({ message: "Product registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
            console.log(error);
        }
    }

    static async getProduct(req: any, res: any,) {

        try {
            let prod = await Product.findByPk(req.query.id)
            res.status(201).json(prod);
        }
        catch (err) {
            res.status(500).json({ message: "Server Error" });
            console.log(err);
        }
    }

    static async addbid(req: any, res: any) {
        try {

            const pid = req.params.pid;
            const currentBid = req.body.currentBid;
            const bidderId = req.body.bidder_id;

            const product = await Product.findByPk(pid);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (currentBid <= 0) {
                return res.status(400).json({ message: "Bid Price must be greater than 0" });
            }

            const maxBid = Math.max(product.current_bid, product.base_price);
            const maxAllowedBid = Math.ceil(maxBid * 1.2);

            if (currentBid > maxAllowedBid) {
                res.status(400).json({ message: "Bid Price exceeds max allowed limit" });
                return;
            }
            if (currentBid <= product.base_price || currentBid <= product.current_bid) {
                res.status(400).json({ message: "Bid Price should be greater than the base price and current price" });
                return;
            }
            await Product.update(
                {
                    current_bid: currentBid, bidder_id: bidderId
                }, { where: { id: pid } }
            );
            res.status(201).json({ message: "Bid Updated Successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
            console.log('error');
        }
    }
}