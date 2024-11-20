import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
    user?: { id: string };
}

export const verifyToken: any = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
