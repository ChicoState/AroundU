import { Router } from 'express';
import eventsRoutes from './events';
import authRoutes from './auth';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({ message: 'OK' });
});

router.use('/auth', authRoutes);

router.use(eventsRoutes);

export default router;
