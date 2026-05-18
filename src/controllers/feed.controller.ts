import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getPublishedArticles = async (req: Request, res: Response) => {
  try {
    const { category, author, q } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    const where: any = {
      status: 'Published',
      deletedAt: null,
    };

    if (category) where.category = category as string;
    if (q) where.title = { contains: q as string, mode: 'insensitive' };
    if (author) {
      where.author = {
        name: { contains: author as string, mode: 'insensitive' },
      };
    }

    const articles = await prisma.article.findMany({
      where,
      include: { author: { select: { name: true } } },
      skip: offset,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
    const total = await prisma.article.count({ where });

    return res.status(200).json({
      Success: true,
      Message: 'Published articles',
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

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const article = await prisma.article.findFirst({
      where: { id: id as string, status: 'Published', deletedAt: null },
      include: { author: { select: { name: true, email: true } } },
    });

    if (!article) {
      return res.status(404).json({
        Success: false,
        Message: 'News article no longer available',
        Object: null,
        Errors: ['Article not found or deleted'],
      });
    }

    // Async read logging – non‑blocking
    (async () => {
      await prisma.readLog.create({
        data: { articleId: id as string, readerId: userId || null },
      });
    })().catch(console.error);

    return res.status(200).json({
      Success: true,
      Message: 'Article retrieved successfully',
      Object: article,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Internal server error',
      Object: null,
      Errors: ['Failed to fetch article'],
    });
  }
};