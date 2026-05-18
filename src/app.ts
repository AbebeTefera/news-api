import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import articleRoutes from './routes/articles.routes';
import feedRoutes from './routes/feed.routes';
import dashboardRoutes from './routes/dashboard.routes';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/author', dashboardRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);
