"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const careReminder_1 = __importDefault(require("../models/careReminder"));
const Comment_1 = require("../models/Comment");
const FeedBack_1 = require("../models/FeedBack");
const Message_1 = require("../models/Message");
const Plant_1 = __importDefault(require("../models/Plant"));
const Plant3Dmoedl_1 = __importDefault(require("../models/Plant3Dmoedl"));
const PlantHealth_1 = __importDefault(require("../models/PlantHealth"));
const Post_1 = require("../models/Post");
const Room_1 = require("../models/Room");
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User_1.default, Plant_1.default, careReminder_1.default, Room_1.Room, Comment_1.Comment, Post_1.Post, Message_1.Message, Plant3Dmoedl_1.default, PlantHealth_1.default, FeedBack_1.Feedback],
    migrations: [],
    subscribers: [],
    extra: {
        max: 10,
    },
});
