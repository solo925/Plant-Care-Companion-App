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
exports.Plant = void 0;
const typeorm_1 = require("typeorm");
const careReminder_1 = __importDefault(require("./careReminder"));
const Plant3Dmoedl_1 = __importDefault(require("./Plant3Dmoedl"));
const PlantHealth_1 = __importDefault(require("./PlantHealth"));
const User_1 = __importDefault(require("./User"));
let Plant = class Plant {
};
exports.Plant = Plant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], Plant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Plant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Plant.prototype, "species", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Plant.prototype, "wateringFrequency", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.default, (user) => user.ownedPlants),
    __metadata("design:type", Array)
], Plant.prototype, "owners", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Plant.prototype, "lastWatered", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Plant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Plant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Plant.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Plant.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Plant.prototype, "growingConditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Plant.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, (user) => user.plants, { onDelete: 'CASCADE' }),
    __metadata("design:type", User_1.default)
], Plant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Plant3Dmoedl_1.default, (models) => models.plant, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Plant.prototype, "models", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PlantHealth_1.default, (healthLog) => healthLog.plant),
    __metadata("design:type", Array)
], Plant.prototype, "healthLogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => careReminder_1.default, (reminder) => reminder.plant),
    __metadata("design:type", Array)
], Plant.prototype, "reminders", void 0);
exports.Plant = Plant = __decorate([
    (0, typeorm_1.Entity)()
], Plant);
exports.default = Plant;
