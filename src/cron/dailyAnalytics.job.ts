import cron from 'node-cron';
import { analyticsQueue } from '../queues/analytics.queue';

cron.schedule('0 0 * * *', async () => {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);
  await analyticsQueue.add('aggregate-daily', { targetDate: yesterday });
  console.log(`Queued analytics for ${yesterday.toISOString()}`);
}, { timezone: 'GMT' });
