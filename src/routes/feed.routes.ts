import { Router } from 'express';
import { getPublishedArticles, getArticleById } from '../controllers/feed.controller';
import { readSpamLimiter } from '../middlewares/rateLimiter';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getPublishedArticles);
router.get('/:id', authMiddleware, readSpamLimiter, getArticleById);

export default router;
