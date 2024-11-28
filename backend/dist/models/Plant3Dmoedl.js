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
exports.Plant3DModel = void 0;
const typeorm_1 = require("typeorm");
const Plant_1 = require("./Plant");
let Plant3DModel = class Plant3DModel {
};
exports.Plant3DModel = Plant3DModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Plant3DModel.prototype, "model_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Plant_1.Plant, (plant) => plant.models, { onDelete: 'CASCADE' }),
    __metadata("design:type", Plant_1.Plant)
], Plant3DModel.prototype, "plant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Plant3DModel.prototype, "model_format", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Plant3DModel.prototype, "model_file_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Plant3DModel.prototype, "created_at", void 0);
exports.Plant3DModel = Plant3DModel = __decorate([
    (0, typeorm_1.Entity)()
], Plant3DModel);
exports.default = Plant3DModel;
