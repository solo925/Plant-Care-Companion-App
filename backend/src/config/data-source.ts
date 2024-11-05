import dotenv from "dotenv"
import "reflect-metadata"
import { DataSource } from "typeorm"
import CareReminder from "../models/careReminder"
import { Comment } from "../models/Comment"
import { Message } from "../models/Message"
import Plant from "../models/Plant"
import Plant3DModel from "../models/Plant3Dmoedl"
import { Post } from "../models/Post"
import { Room } from "../models/Room"
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
    entities: [User, Plant, CareReminder, Room, Comment, Post, Message, Plant3DModel],
    migrations: [],
    subscribers: [],
    extra: {
        max: 10,
    },
})
