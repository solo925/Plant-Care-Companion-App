"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).required().messages({
        'string.empty': '"name" is not allowed to be empty',
    }),
    email: joi_1.default.string().email().required().messages({
        'string.empty': '"email" is required',
        'string.email': '"email" must be a valid email',
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.empty': '"password" is required',
        'string.min': '"password" should have a minimum length of 6',
    }),
    confirmpassword: joi_1.default.any().valid(joi_1.default.ref('password')).required().messages({
        'any.only': '"confirmPassword" must match "password"',
        'any.required': '"confirmPassword" is required',
    }),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.'
    }),
    password: joi_1.default.string().required().messages({
        'string.min': 'Password must be at least 6 characters.',
        'any.required': 'Password is required.'
    })
});
