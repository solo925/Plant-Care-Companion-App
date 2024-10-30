import express from "express";
import "reflect-metadata";
import { AppDataSource } from "../src/config/data-source";
import mainRoute from "./routes/main";


const app = express();

app.use(express.json());

// Test database connection
AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");

        // Optional: Test a sample query to check CRUD functionality
        const testConnection = await AppDataSource.query("SELECT 1;");
        console.log("Connection test query result:", testConnection);
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });


app.use('/api/v1', mainRoute);

export default app;
