import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const createArticle = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user.id;
    const { title, content, category, status } = req.body;

    const article = await prisma.article.create({
      data: { title, content, category, status, authorId },
    });
    return res.status(201).json({
      Success: true,
      Message: 'Article created',
      Object: article,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Failed to create article',
      Object: null,
      Errors: ['Database error'],
    });
  }
};

export const getMyArticles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      skip: offset,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
    const total = await prisma.article.count({ where: { authorId: userId } });

    return res.status(200).json({
      Success: true,
      Message: 'Your articles',
      Object: articles,
      PageNumber: page,
      PageSize: pageSize,
      TotalSize: total,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Failed to fetch articles',
      Object: null,
      Errors: ['Database error'],
    });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { title, content, category, status } = req.body;

    const article = await prisma.article.findFirst({
      where: { id: id as string, authorId: userId, deletedAt: null },
    });
    if (!article) {
      return res.status(403).json({
        Success: false,
        Message: 'Forbidden',
        Object: null,
        Errors: ['You can only edit your own articles'],
      });
    }

    const updated = await prisma.article.update({
      where: { id: id as string },
      data: { title, content, category, status },
    });
    return res.status(200).json({
      Success: true,
      Message: 'Article updated',
      Object: updated,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Failed to update article',
      Object: null,
      Errors: ['Database error'],
    });
  }
};
export const getArticleByIdForAuthor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const article = await prisma.article.findFirst({
      where: { id: id as string, authorId: userId },
    });
    if (!article) {
      return res.status(404).json({
        Success: false,
        Message: 'Article not found',
        Object: null,
        Errors: ['Not found or you are not the author'],
      });
    }
    return res.status(200).json({
      Success: true,
      Message: 'Article retrieved',
      Object: article,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Failed to fetch article',
      Object: null,
      Errors: ['Database error'],
    });
  }
};
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const article = await prisma.article.findFirst({
      where: { id: id as string, authorId: userId, deletedAt: null },
    });
    if (!article) {
      return res.status(403).json({
        Success: false,
        Message: 'Forbidden',
        Object: null,
        Errors: ['You can only delete your own articles'],
      });
    }

    await prisma.article.update({
      where: { id: id as string },
      data: { deletedAt: new Date() },
    });
    return res.status(200).json({
      Success: true,
      Message: 'Article soft deleted',
      Object: null,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Failed to delete article',
      Object: null,
      Errors: ['Database error'],
    });
  }
};