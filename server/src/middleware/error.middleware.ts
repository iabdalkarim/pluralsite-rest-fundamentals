import { NextFunction, Request, Response } from "express";
import {
  InsufficientScopeError,
  InvalidTokenError,
  UnauthorizedError,
} from "express-oauth2-jwt-bearer";

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.log(error);
  if (error instanceof InvalidTokenError) {
    const status = error.statusCode;
    const message = "Bad Credentials";
    return response.status(status).json({ message });
  }
  
  if (error instanceof InsufficientScopeError) {
    const status = error.statusCode;
    const message = "Permission denied";
    return response.status(status).json({ message });
  }

  if (error instanceof UnauthorizedError) {
    const status = error.statusCode;
    const message = "Require Authentication";
    return response.status(status).json({ message });
  }

  const status = 500;
  const message = "Internal Server Error";

  response.status(status).json({ message });
};
