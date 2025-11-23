import { Hono } from "hono";
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { CreatorEntity, ContentEntity, TierEntity, SubscriptionEntity, TokenTransactionEntity, UserTokensEntity } from './entities';
import { MOCK_TOP_TIPPERS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Seed data on first request in dev, or on deploy
  app.use('*', async (c, next) => {
    await Promise.all([
      CreatorEntity.ensureSeed(c.env),
      ContentEntity.ensureSeed(c.env),
      TierEntity.ensureSeed(c.env),
      SubscriptionEntity.ensureSeed(c.env),
      TokenTransactionEntity.ensureSeed(c.env),
      UserTokensEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // GET /api/dashboard - Creator Dashboard data
  app.get('/api/dashboard', async (c) => {
    const creatorId = 'c1'; // Hardcoded for now
    const creator = await new CreatorEntity(c.env, creatorId).getState();
    const content = await ContentEntity.list(c.env);
    const tiers = await TierEntity.list(c.env);
    return ok(c, {
      creator,
      content: content.items,
      tiers: tiers.items,
      topTippers: MOCK_TOP_TIPPERS, // Mocked for now
    });
  });
  // GET /api/creator/:creatorId - Public creator view
  app.get('/api/creator/:creatorId', async (c) => {
    const { creatorId } = c.req.param();
    const creator = await new CreatorEntity(c.env, creatorId).getState();
    if (!creator.name) return notFound(c, 'Creator not found');
    const content = await ContentEntity.list(c.env); // In a real app, filter by creatorId
    const tiers = await TierEntity.list(c.env); // In a real app, filter by creatorId
    const subscription = await new SubscriptionEntity(c.env, 'sub1').getState(); // Mocked for user 'u1'
    return ok(c, {
      creator,
      content: content.items.filter(item => item.creatorId === creatorId),
      tiers: tiers.items.filter(tier => tier.creatorId === creatorId),
      subscription,
    });
  });
  // GET /api/tokens - User's token data
  app.get('/api/tokens', async (c) => {
    const userId = 'u1'; // Hardcoded for now
    const userTokens = await new UserTokensEntity(c.env, userId).getState();
    const transactions = await TokenTransactionEntity.list(c.env);
    return ok(c, {
      balance: userTokens.balance,
      transactions: transactions.items.filter(tx => tx.userId === userId),
    });
  });
  // POST /api/content - Create new content
  const contentSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    type: z.enum(["video", "download", "post"]),
    tierId: z.string(),
    publishDate: z.string().datetime().optional(),
  });
  app.post('/api/content', zValidator('json', contentSchema), async (c) => {
    const data = c.req.valid('json');
    const creatorId = 'c1'; // Hardcoded
    const status = data.publishDate && new Date(data.publishDate) > new Date() ? 'scheduled' : 'published';
    const newContent = {
      id: crypto.randomUUID(),
      creatorId,
      title: data.title,
      description: data.description || '',
      type: data.type,
      tierId: data.tierId,
      publishedAt: data.publishDate ? new Date(data.publishDate) : new Date(),
      status,
      attachments: [],
    };
    await ContentEntity.create(c.env, newContent);
    return ok(c, newContent);
  });
  // A simple test route to confirm the worker is running.
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CraftLedger API' }}));
}