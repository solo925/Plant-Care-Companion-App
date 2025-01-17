"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CareReminder_1 = __importDefault(require("../controllers/careReminder/CareReminder"));
const careReminderRoute = express_1.default.Router();
careReminderRoute.use('/', CareReminder_1.default);
exports.default = careReminderRoute;
