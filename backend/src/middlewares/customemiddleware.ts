import { NextFunction } from "express";
import { R2 } from "./apiVersioning/apiversion";

const requestLogger = (req:R2, res:Response, next:NextFunction) => {
    const timeStamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.get("User-Agent");
    console.log(`[${timeStamp}] ${method} ${url} - ${userAgent}`);
    next();
  };
  
  const addTimeStamp = (req:R2, res:Response, next:NextFunction) => {
    req.timeStamp = new Date().toISOString();
    next();
  };
  
  module.exports = { requestLogger, addTimeStamp };
  