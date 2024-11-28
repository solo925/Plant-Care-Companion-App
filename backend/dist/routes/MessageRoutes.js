"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MessageController_1 = __importDefault(require("../controllers/communicationForum/MessageController"));
const messageRoute = express_1.default.Router();
messageRoute.use('/', MessageController_1.default);
exports.default = messageRoute;
