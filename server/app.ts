import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./ormconfig";

const app = express();

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

export default app;
