import bcrypt from 'bcrypt';
import { expect } from 'chai';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { AppDataSource } from '../../config/data-source';
import LoginController from './loginController';

// Set up Express app
const app = express();
app.use(express.json());
app.use('/login', LoginController);

// Mocking the user data
const mockUser: any = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword', // This should be a hashed password
    profilePhoto: 'profile.jpg',
};

// Mocha Test Suite
describe('LoginController', () => {
    it('should return 400 if validation fails', async () => {
        const response = await request(app).post('/login').send({ email: 'invalidEmail' });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.a('string');
    });

    it('should return 400 if user does not exist', async () => {
        // Mock the repository's findOne method to return null
        const mockRepository = {
            findOne: () => Promise.resolve(null),
        };
        (AppDataSource.getRepository as any).mockReturnValue(mockRepository);

        const response = await request(app).post('/login').send({ email: 'john@example.com', password: 'password' });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Invalid email or password');
    });

    it('should return 400 if password is incorrect', async () => {
        const mockRepository = {
            findOne: () => Promise.resolve(mockUser),
        };
        (AppDataSource.getRepository as any).mockReturnValue(mockRepository);
        (bcrypt.compare as any).mockResolvedValue(false); // Mocking incorrect password check

        const response = await request(app).post('/login').send({ email: 'john@example.com', password: 'wrongPassword' });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Invalid email or password');
    });

    it('should return 200 and a token if login is successful', async () => {
        const mockRepository = {
            findOne: () => Promise.resolve(mockUser),
        };
        (AppDataSource.getRepository as any).mockReturnValue(mockRepository);
        (bcrypt.compare as any).mockResolvedValue(true); // Correct password
        (jwt.sign as any).mockReturnValue('mockToken'); // Mock JWT token

        const response = await request(app).post('/login').send({ email: 'john@example.com', password: 'correctPassword' });

        expect(response.status).to.equal(200);
        expect(response.body.token).to.equal('mockToken');
        expect(response.body.user).to.deep.equal({
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
        (AppDataSource.getRepository as any).mockReturnValue(mockRepository);

        const response = await request(app).post('/login').send({ email: 'john@example.com', password: 'password' });

        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('Server error');
    });
});
