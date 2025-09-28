import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodIssue } from 'zod';
import { ValidationError } from '../utils/errors';

export interface ValidatedRequest<T = Record<string, unknown>> extends Request {
  validatedData: T;
}

export const validateRequest = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      (req as ValidatedRequest<z.infer<T>>).validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: ZodIssue) => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });

        throw new ValidationError(`Validation failed: ${errorMessages.join(', ')}`);
      }
      next(error);
    }
  };
};