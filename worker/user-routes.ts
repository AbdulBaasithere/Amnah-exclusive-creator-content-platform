import { Hono } from "hono";
import type { Env } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // A simple test route to confirm the worker is running.
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CraftLedger API' }}));
  // CraftLedger specific routes will be added here in Phase 3.
}