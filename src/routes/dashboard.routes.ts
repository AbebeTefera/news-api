import { Router } from 'express';
import { getAuthorDashboard } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(['author']));

router.get('/dashboard', getAuthorDashboard);

export default router;
