"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProfileController_1 = __importDefault(require("../controllers/userProfile/ProfileController"));
const profileroute = express_1.default.Router();
profileroute.use('/', ProfileController_1.default);
exports.default = profileroute;
