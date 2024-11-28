"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planthealhRoute = exports.plantRouter = void 0;
const express_1 = __importDefault(require("express"));
const PlantController_1 = __importDefault(require("../controllers/plants/PlantController"));
const PlantHealthTracker_1 = __importDefault(require("../controllers/plants/PlantHealthTracker"));
exports.plantRouter = express_1.default.Router();
exports.planthealhRoute = express_1.default.Router();
exports.planthealhRoute.use('/', PlantHealthTracker_1.default);
exports.plantRouter.use('/', PlantController_1.default);
