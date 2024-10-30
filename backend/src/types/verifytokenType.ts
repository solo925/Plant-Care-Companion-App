import { NextFunction, Request, Response } from "express";
export interface verifytype extends Request {
    user?: any;
    req?: Request;
    res?: Response;
    next?: NextFunction;
    token?: string | undefined | null | any;


}