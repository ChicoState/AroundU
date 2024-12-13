import { Request, Response, NextFunction } from 'express';

const authenticationHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Forbidden: Unauthorized access.' });
  }
  return next();
};

export default authenticationHandler;
