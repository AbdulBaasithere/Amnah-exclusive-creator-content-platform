import { Hono } from "hono";
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { CreatorEntity, ContentEntity, TierEntity, SubscriptionEntity, TokenTransactionEntity, UserTokensEntity } from './entities';
import { MOCK_TOP_TIPPERS, MOCK_ANALYTICS_DATA } from "@shared/mock-data";
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
    const content = await ContentEntity.list(c.env);
    const tiers = await TierEntity.list(c.env);
    const subscription = await new SubscriptionEntity(c.env, 'sub1').getState();
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
  // GET /api/analytics
  app.get('/api/analytics', (c) => {
    return ok(c, MOCK_ANALYTICS_DATA);
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
  // POST /api/tokens/purchase
  const tokenPurchaseSchema = z.object({ amount: z.number().positive() });
  app.post('/api/tokens/purchase', zValidator('json', tokenPurchaseSchema), async (c) => {
    const { amount } = c.req.valid('json');
    const userId = 'u1';
    const userTokens = new UserTokensEntity(c.env, userId);
    await userTokens.mutate(state => ({ ...state, balance: state.balance + amount }));
    const newTx = {
      id: crypto.randomUUID(),
      userId,
      amount,
      reason: 'Token Purchase',
      ts: new Date(),
    };
    await TokenTransactionEntity.create(c.env, newTx);
    return ok(c, { newBalance: (await userTokens.getState()).balance });
  });
  // POST /api/subscriptions
  const subscriptionSchema = z.object({ tierId: z.string() });
  app.post('/api/subscriptions', zValidator('json', subscriptionSchema), async (c) => {
    const { tierId } = c.req.valid('json');
    const userId = 'u1';
    const creatorId = 'c1';
    const subId = 'sub1'; // For demo, we update the existing subscription
    const subscription = new SubscriptionEntity(c.env, subId);
    await subscription.mutate(state => ({ ...state, tierId, active: true, creatorId, userId }));
    return ok(c, await subscription.getState());
  });
  // POST /api/payouts
  const payoutSchema = z.object({ amount: z.number().min(50) });
  app.post('/api/payouts', zValidator('json', payoutSchema), async (c) => {
    const { amount } = c.req.valid('json');
    const creatorId = 'c1';
    const creator = new CreatorEntity(c.env, creatorId);
    const currentBalance = (await creator.getState()).balance;
    if (amount > currentBalance) {
      return bad(c, 'Payout amount exceeds balance.');
    }
    await creator.mutate(state => ({ ...state, balance: state.balance - amount }));
    // In a real app, you'd create a payout record and queue it for processing.
    console.log(`Payout of $${amount} requested for creator ${creatorId}`);
    return ok(c, { success: true, newBalance: (await creator.getState()).balance });
  });
}