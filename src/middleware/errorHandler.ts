import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { CheckoutError } from '../utils/errors';

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}

export interface ErrorResponse {
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
    details?: ValidationErrorDetail[];
  };
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error occurred:', error);

  if (error instanceof ZodError) {
    const validationErrors: ValidationErrorDetail[] = error.issues.map((err: ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));

    const errorResponse: ErrorResponse = {
      error: {
        message: 'Validation failed',
        statusCode: 400,
        timestamp: new Date().toISOString(),
        details: validationErrors,
      },
    };

    res.status(400).json(errorResponse);
    return;
  }

  if (error instanceof CheckoutError) {
    const errorResponse: ErrorResponse = {
      error: {
        message: error.message,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString(),
      },
    };

    res.status(error.statusCode).json(errorResponse);
    return;
  }

  const errorResponse: ErrorResponse = {
    error: {
      message: 'Internal server error',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(500).json(errorResponse);
};