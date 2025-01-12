import { Response, NextFunction } from "express";

interface CustomRequest extends Request {
  timeStamp?: string;
  pathparam?:any
  get:(agent:string)=>string
}


const requestLogger = (req: any, res: Response, next: NextFunction) => {
  const timeStamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get("User-Agent");
  console.log(`[${timeStamp}] ${method} ${url} - ${userAgent}`);
  next();
};

const addTimeStamp = (req: any, res: Response, next: NextFunction) => {
  req.timeStamp = new Date().toISOString();
  next();
};

export { requestLogger, addTimeStamp };
