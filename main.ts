import express  from "express";
import * as dotenv from 'dotenv';
import router from "./src/routes/routers";
import { sequelize, dbconnection } from "./src/database/database";
// import bodyParser from "body-parser";

const app = express();
dotenv.config();

app.use(express.json());
const port = process.env.DB_PORT;

try{
dbconnection();
} catch(error){
    console.log("Internal Server Error, Failed to connect to Database", error);
    
}
app.use('/', router);

// async function syncModels(){
//     try{
//         await sequelize.sync({force: true});
//         console.log("Models synchronised successfully");
//     } catch(error){
//         console.log('Error !!!,', error);
//     }
// }
// syncModels();
app.listen(port, ()=> {
    console.log(`listning at ${port}`);
})