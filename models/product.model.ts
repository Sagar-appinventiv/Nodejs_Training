import Sequelize from "sequelize";
import { sequelize,dbconnection } from "../core/connection";
const Product = sequelize.define('Products',{
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    name: {type: Sequelize.STRING},
    description: {type: Sequelize.STRING},
    base_price: {type: Sequelize.INTEGER},
    current_bid: {type: Sequelize.INTEGER,
      // validate: {
      //   checkPrice(){
      //     if(this.current_bid){

      //     }
      //   }
      // }
    },
    owner_id: {type: Sequelize.INTEGER},
    bidder_id: {type: Sequelize.INTEGER},
    category_id: {type: Sequelize.INTEGER},
    address_id: {type: Sequelize.INTEGER},
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
});

export{Product};