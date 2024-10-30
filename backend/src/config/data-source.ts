import dotenv from "dotenv"
import "reflect-metadata"
import { DataSource } from "typeorm"
import User from "../models/User"


dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
    extra: {
        max: 10,
    },
})
