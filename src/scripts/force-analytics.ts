import { prisma } from '../config/database';

async function run() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const startDate = today;
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  const readGroups = await prisma.readLog.groupBy({
    by: ['articleId'],
    where: {
      readAt: { gte: startDate, lt: endDate },
    },
    _count: { id: true },
  });

  for (const group of readGroups) {
    await prisma.dailyAnalytics.upsert({
      where: { articleId_date: { articleId: group.articleId, date: startDate } },
      update: { viewCount: { increment: group._count.id } },
      create: { articleId: group.articleId, date: startDate, viewCount: group._count.id },
    });
  }

  console.log(`Aggregated ${readGroups.length} articles for ${startDate.toISOString()}`);
  process.exit(0);
}
run();
