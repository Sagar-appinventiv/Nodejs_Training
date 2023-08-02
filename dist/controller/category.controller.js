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
exports.category = void 0;
const connection_1 = require("../core/connection");
const sequelize_1 = require("sequelize");
class category {
    //****** By using Recursive CTE to find category and sub category in one API *******/
    static getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recursiveQuery = `
        WITH RECURSIVE category_recursive AS (
            -- Anchor member
            SELECT id, name, parent_id
            FROM "Categories"
            WHERE parent_id IS NULL
          
            UNION ALL
          
            -- Recursive member
            SELECT c.id, c.name, c.parent_id
            FROM "Categories" c
            INNER JOIN category_recursive cr ON c.parent_id = cr.id
          )
          
          SELECT *
          FROM category_recursive
        `;
                const categoriesWithSubcategories = yield connection_1.sequelize.query(recursiveQuery, {
                    type: sequelize_1.QueryTypes.SELECT,
                });
                res.status(200).json(categoriesWithSubcategories);
            }
            catch (error) {
                res.status(500).json({ message: "Server Error" });
                //         console.error(error);
                //     }
            }
        });
    }
}
exports.category = category;
//# sourceMappingURL=category.controller.js.map