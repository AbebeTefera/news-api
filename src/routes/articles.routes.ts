import { Router } from 'express';
import { createArticle, getMyArticles, updateArticle, deleteArticle, getArticleByIdForAuthor } from '../controllers/articles.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createArticleSchema, updateArticleSchema } from '../validations/article.validation';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(['author']));

router.post('/', validate(createArticleSchema), createArticle);
router.get('/me', getMyArticles);
router.get('/:id', getArticleByIdForAuthor);   
router.put('/:id', validate(updateArticleSchema), updateArticle);
router.delete('/:id', deleteArticle);

export default router;
