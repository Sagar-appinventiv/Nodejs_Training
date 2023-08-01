import  Sequelize  from "sequelize";
import { sequelize,dbconnection } from "../core/connection";

const Address = sequelize.define('Addresses',{
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    street1: {type: Sequelize.STRING},
    street2: {type: Sequelize.STRING},
    landmark: {type: Sequelize.STRING},
    city: {type: Sequelize.STRING},
    state: {type: Sequelize.STRING},
    zip_code: {type: Sequelize.INTEGER},
    address_type: {type: Sequelize.ENUM("Work", "Home","other")},
    user_id: {type: Sequelize.INTEGER},
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
});
console.log("user model");
export{Address};