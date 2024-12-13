import { Request } from 'express';

const save = async (req: Request): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(new Error('Session save failed'));
      } else {
        resolve();
      }
    });
  });
};

const destroy = async (req: Request): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(new Error('Session destroy failed'));
      } else {
        resolve();
      }
    });
  });
};

export default {
  save,
  destroy,
};
