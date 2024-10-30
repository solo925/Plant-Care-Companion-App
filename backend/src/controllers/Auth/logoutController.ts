import express, { Request, Response } from 'express';

export const LogoutController = express.Router();

// An in-memory array to store blacklisted tokens (consider a better solution for production)
let blacklistedTokens: string[] = [];

LogoutController.post('/', (req: Request, res: Response): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        blacklistedTokens.push(token); // Add token to blacklist
        res.status(200).json({ message: 'Logged out successfully' });
    } else {
        res.status(400).json({ message: 'No token provided' });
    }
});

export default LogoutController;
