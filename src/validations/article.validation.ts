import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().min(50),
  category: z.string(),
  status: z.enum(['Draft', 'Published']).default('Draft'),
});

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  content: z.string().min(50).optional(),
  category: z.string().optional(),
  status: z.enum(['Draft', 'Published']).optional(),
});
