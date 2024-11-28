"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantHealthLog = void 0;
const typeorm_1 = require("typeorm");
const Plant_1 = require("./Plant");
const User_1 = require("./User");
let PlantHealthLog = class PlantHealthLog {
};
exports.PlantHealthLog = PlantHealthLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], PlantHealthLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PlantHealthLog.prototype, "healthStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], PlantHealthLog.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PlantHealthLog.prototype, "possibleCauses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PlantHealthLog.prototype, "preventiveMeasures", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PlantHealthLog.prototype, "observationDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Plant_1.Plant, (plant) => plant.healthLogs, { onDelete: 'CASCADE' }),
    __metadata("design:type", Plant_1.Plant)
], PlantHealthLog.prototype, "plant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.healthLogs, { onDelete: 'CASCADE' }),
    __metadata("design:type", User_1.User)
], PlantHealthLog.prototype, "user", void 0);
exports.PlantHealthLog = PlantHealthLog = __decorate([
    (0, typeorm_1.Entity)()
], PlantHealthLog);
exports.default = PlantHealthLog;
