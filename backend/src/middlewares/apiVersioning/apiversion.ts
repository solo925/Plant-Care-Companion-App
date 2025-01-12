import { Request, Response, NextFunction } from "express";

export interface R2 extends Request {
  path: string;
  timeStamp?: string;
}

type Middleware = (req: R2, res: Response, next: NextFunction) => void;

export const urlVersioning = (version: string): Middleware => {
  return (req, res, next) => {
    if (req.path.startsWith(`/api/${version}`)) {
      next();
    } else {
      res.status(404).json({
        success: false,
        error: "API version is not supported",
      });
    }
  };
};

// export const headerVersioning = (version: string): Middleware => {
//   return (req, res, next) => {
//     if (req.get("Accept-Version") === version) {
//       next();
//     } else {
//       res.status(404).json({
//         success: false,
//         error: "API version is not supported",
//       });
//     }
//   };
// };

// export const contentTypeVersioning = (version: string): Middleware => {
//   return (req, res, next) => {
//     const contentType = req.get("Content-Type");

//     if (
//       contentType &&
//       contentType.includes(`application/vnd.api.${version}+json`)
//     ) {
//       next();
//     } else {
//       res.status(404).json({
//         success: false,
//         error: "API version is not supported",
//       });
//     }
//   };
// };

export default urlVersioning ;
