import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
  next(err);
};

export default errorHandler;
