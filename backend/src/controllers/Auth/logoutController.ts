import express, { Request, Response } from 'express';

export const LogoutController = express.Router();


let blacklistedTokens: string[] = [];

LogoutController.post('/', (req: Request, res: Response): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
        blacklistedTokens.push(token);
        res.status(200).json({ message: 'Logged out successfully' });
    } else {
        res.status(400).json({ message: 'No token provided' });
    }
});

export default LogoutController;
