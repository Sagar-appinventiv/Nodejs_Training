import express, { Router } from "express";
import * as  dotenv from 'dotenv';
import { sequelize, dbconnection } from "./core/connection";
import { appRoutes } from "./router/index.route";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options:swaggerJSDoc.options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Advertisment Management System",
            version: "1.0.0"
        },
        schemas:['http', 'https'],
        servers: [
        {
            url: "http://localhost:3003/"
        }
        ]
    },
    apis: ['./swagger/user.servicedoc.yaml','./swagger/product.servicedoc.yaml'],
    
};

const app = express();
dotenv.config();

async () => {
    await dbconnection();
}

app.use(express.json());
const port = process.env.PORT;
app.use("/", appRoutes.loadAppRoutes());

const swaggerDocument = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`listening at port ${port}`);
})