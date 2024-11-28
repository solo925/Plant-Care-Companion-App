"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutController = void 0;
const express_1 = __importDefault(require("express"));
exports.LogoutController = express_1.default.Router();
let blacklistedTokens = [];
exports.LogoutController.post('/', (req, res) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        blacklistedTokens.push(token);
        res.status(200).json({ message: 'Logged out successfully' });
    }
    else {
        res.status(400).json({ message: 'No token provided' });
    }
});
exports.default = exports.LogoutController;
