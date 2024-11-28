"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GetAllUsers_1 = __importDefault(require("../controllers/usersManagement/GetAllUsers"));
const usersRoute = express_1.default.Router();
usersRoute.use('/', GetAllUsers_1.default);
exports.default = usersRoute;
