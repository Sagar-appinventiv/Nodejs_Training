"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.product = void 0;
const product_model_1 = require("../models/product.model");
class product {
    static addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = req.body;
            try {
                yield product_model_1.Product.create(detail);
                res.status(201).json({ message: "Product registered successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
                console.log(error);
            }
        });
    }
    static getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let prod = yield product_model_1.Product.findByPk(req.query.id);
                res.status(201).json(prod);
            }
            catch (err) {
                res.status(500).json({ message: "Server Error" });
                console.log(err);
            }
        });
    }
    static addbid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pid = req.params.pid;
                const currentBid = req.body.currentBid;
                const bidderId = req.body.bidder_id;
                const product = yield product_model_1.Product.findByPk(pid);
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
                yield product_model_1.Product.update({
                    current_bid: currentBid, bidder_id: bidderId
                }, { where: { id: pid } });
                res.status(201).json({ message: "Bid Updated Successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
                console.log('error');
            }
        });
    }
}
exports.product = product;
//# sourceMappingURL=product.controller.js.map