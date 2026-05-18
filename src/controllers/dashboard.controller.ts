import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getAuthorDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    const articles = await prisma.article.findMany({
      where: {
        authorId: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        dailyStats: {
          select: { viewCount: true },
        },
      },
      skip: offset,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.article.count({
      where: { authorId: userId, deletedAt: null },
    });

    const formatted = articles.map(article => ({
      title: article.title,
      createdAt: article.createdAt,
      totalViews: article.dailyStats.reduce((sum, stat) => sum + stat.viewCount, 0),
    }));

    return res.status(200).json({
      Success: true,
      Message: 'Dashboard data',
      Object: formatted,
      PageNumber: page,
      PageSize: pageSize,
      TotalSize: total,
      Errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Message: 'Failed to fetch dashboard',
      Object: null,
      Errors: ['Database error'],
    });
  }
};
