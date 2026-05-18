import { app } from './app';
import { env } from './config/env';
import './cron/dailyAnalytics.job'; // Uncomment later when Redis is ready

const PORT = typeof env.port === 'string' ? parseInt(env.port, 10) : env.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});