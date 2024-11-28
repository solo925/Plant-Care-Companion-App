"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostController_1 = __importDefault(require("../controllers/communicationForum/PostController"));
const postRoute = express_1.default.Router();
postRoute.use('/', PostController_1.default);
exports.default = postRoute;
