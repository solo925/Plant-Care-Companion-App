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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareReminder = void 0;
const typeorm_1 = require("typeorm");
const Plant_1 = __importDefault(require("./Plant"));
const User_1 = __importDefault(require("./User"));
let CareReminder = class CareReminder {
};
exports.CareReminder = CareReminder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], CareReminder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], CareReminder.prototype, "reminderDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CareReminder.prototype, "plantId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CareReminder.prototype, "reminderType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CareReminder.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CareReminder.prototype, "nextReminder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CareReminder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CareReminder.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CareReminder.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.careReminder, { onDelete: 'CASCADE' }),
    __metadata("design:type", User_1.default)
], CareReminder.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Plant_1.default, (plant) => plant.careReminder, { onDelete: 'CASCADE' }),
    __metadata("design:type", Plant_1.default)
], CareReminder.prototype, "plant", void 0);
exports.CareReminder = CareReminder = __decorate([
    (0, typeorm_1.Entity)()
], CareReminder);
exports.default = CareReminder;
