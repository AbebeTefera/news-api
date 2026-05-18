import Bull from 'bull';
import { prisma } from '../config/database';
import { env } from '../config/env';

export const analyticsQueue = new Bull('analytics', env.redisUrl, {
  redis: {
    // Required options to avoid error
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  },
});

analyticsQueue.process('aggregate-daily', async (job) => {
  const { targetDate } = job.data;
  const startDate = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()));
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  const readGroups = await prisma.readLog.groupBy({
    by: ['articleId'],
    where: {
      readAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    _count: { id: true },
  });

  for (const group of readGroups) {
    await prisma.dailyAnalytics.upsert({
      where: {
        articleId_date: {
          articleId: group.articleId,
          date: startDate,
        },
      },
      update: {
        viewCount: { increment: group._count.id },
      },
      create: {
        articleId: group.articleId,
        date: startDate,
        viewCount: group._count.id,
      },
    });
  }
  return { processed: readGroups.length };
});
