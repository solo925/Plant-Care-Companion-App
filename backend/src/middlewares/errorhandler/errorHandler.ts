import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";

// Custom APIError class
export class APIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError"; 
    Object.setPrototypeOf(this, APIError.prototype); // Ensure proper inheritance for built-in classes
  }
}

// Async handler middleware
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Global error handler middleware
export const globalErrorHandler = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error(err.stack);

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  }

  // Handle TypeORM query errors
  if (err instanceof QueryFailedError) {
    return res.status(400).json({
      status: "error",
      message: "A database query error occurred",
      detail: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
    });
  }

 
  return res.status(500).json({
    status: "error",
    message: "An unexpected error occurred",
  });
};
