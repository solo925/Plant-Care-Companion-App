"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetRouet = exports.LoginRouter = exports.RegisterRoute = void 0;
const express_1 = __importDefault(require("express"));
const loginController_1 = __importDefault(require("../controllers/Auth/loginController"));
const RegisterController_1 = __importDefault(require("../controllers/Auth/RegisterController"));
const ResetPassword_1 = __importDefault(require("../controllers/Auth/ResetPassword"));
exports.RegisterRoute = express_1.default.Router();
exports.LoginRouter = express_1.default.Router();
exports.passwordResetRouet = express_1.default.Router();
exports.RegisterRoute.use('/', RegisterController_1.default);
exports.LoginRouter.use('/', loginController_1.default);
exports.passwordResetRouet.use('/', ResetPassword_1.default);
