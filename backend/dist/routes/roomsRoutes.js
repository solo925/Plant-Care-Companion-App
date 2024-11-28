"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const oomController_1 = __importDefault(require("../controllers/communicationForum/oomController"));
const roomRouter = express_1.default.Router();
roomRouter.use('/', oomController_1.default);
exports.default = roomRouter;
