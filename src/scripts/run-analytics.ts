import { prisma } from '../config/database';
import { analyticsQueue } from '../queues/analytics.queue';

async function run() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  await analyticsQueue.add('aggregate-daily', { targetDate: today });
  console.log('Aggregation job queued for today');
  process.exit(0);
}
run();