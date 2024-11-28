"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const chai_1 = require("chai");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const data_source_1 = require("../../config/data-source");
const loginController_1 = __importDefault(require("./loginController"));
// Set up Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/login', loginController_1.default);
// Mocking the user data
const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword', // This should be a hashed password
    profilePhoto: 'profile.jpg',
};
// Mocha Test Suite
describe('LoginController', () => {
    it('should return 400 if validation fails', async () => {
        const response = await (0, supertest_1.default)(app).post('/login').send({ email: 'invalidEmail' });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.body.message).to.be.a('string');
    });
    it('should return 400 if user does not exist', async () => {
        // Mock the repository's findOne method to return null
        const mockRepository = {
            findOne: () => Promise.resolve(null),
        };
        data_source_1.AppDataSource.getRepository.mockReturnValue(mockRepository);
        const response = await (0, supertest_1.default)(app).post('/login').send({ email: 'john@example.com', password: 'password' });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.body.message).to.equal('Invalid email or password');
    });
    it('should return 400 if password is incorrect', async () => {
        const mockRepository = {
            findOne: () => Promise.resolve(mockUser),
        };
        data_source_1.AppDataSource.getRepository.mockReturnValue(mockRepository);
        bcrypt_1.default.compare.mockResolvedValue(false); // Mocking incorrect password check
        const response = await (0, supertest_1.default)(app).post('/login').send({ email: 'john@example.com', password: 'wrongPassword' });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.body.message).to.equal('Invalid email or password');
    });
    it('should return 200 and a token if login is successful', async () => {
        const mockRepository = {
            findOne: () => Promise.resolve(mockUser),
        };
        data_source_1.AppDataSource.getRepository.mockReturnValue(mockRepository);
        bcrypt_1.default.compare.mockResolvedValue(true); // Correct password
        jsonwebtoken_1.default.sign.mockReturnValue('mockToken'); // Mock JWT token
        const response = await (0, supertest_1.default)(app).post('/login').send({ email: 'john@example.com', password: 'correctPassword' });
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.body.token).to.equal('mockToken');
        (0, chai_1.expect)(response.body.user).to.deep.equal({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            profilePhoto: mockUser.profilePhoto,
        });
    });
    it('should return 500 if there is a server error', async () => {
        const mockRepository = {
            findOne: () => Promise.reject(new Error('Database error')), // Simulating a database failure
        };
        data_source_1.AppDataSource.getRepository.mockReturnValue(mockRepository);
        const response = await (0, supertest_1.default)(app).post('/login').send({ email: 'john@example.com', password: 'password' });
        (0, chai_1.expect)(response.status).to.equal(500);
        (0, chai_1.expect)(response.body.message).to.equal('Server error');
    });
});
