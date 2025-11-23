import type {
  Creator,
  ContentItem,
  Tier,
  UserProfile,
  Subscription,
  UserTokens,
  TokenTransaction,
} from './types';
// --- MOCK DATA ---
export const MOCK_CREATOR: Creator = {
  id: 'c1',
  name: 'Alex Dev',
  bio: 'Full-stack developer sharing tutorials on React, Node.js, and Cloudflare Workers. Join my community for exclusive content and source code!',
  avatar: 'https://i.pravatar.cc/150?u=alexdev',
  balance: 7450.50,
};
export let MOCK_CONTENT_ITEMS: ContentItem[] = [
  { id: 'content1', creatorId: 'c1', title: 'Building a SaaS with Cloudflare Workers', description: 'A deep dive into serverless architecture.', type: 'video', tierId: 't2', publishedAt: new Date('2023-10-26'), status: 'published', attachments: [] },
  { id: 'content2', creatorId: 'c1', title: 'Project Source Code: SaaS Boilerplate', description: 'Get the full source code for the project.', type: 'download', tierId: 't2', publishedAt: new Date('2023-10-26'), status: 'published', attachments: [{ url: '#', name: 'source-code.zip' }] },
  { id: 'content3', creatorId: 'c1', title: 'Weekly Q&A Session', description: 'Answering your questions live.', type: 'post', tierId: 't1', publishedAt: new Date('2023-10-20'), status: 'published', attachments: [] },
  { id: 'content4', creatorId: 'c1', title: 'Advanced Durable Objects Patterns', description: 'Exploring complex state management.', type: 'video', tierId: 't3', publishedAt: new Date('2023-11-05'), status: 'scheduled', attachments: [] },
  { id: 'content5', creatorId: 'c1', title: 'New Course Announcement (Draft)', description: 'Something new is coming!', type: 'post', tierId: 't1', publishedAt: new Date(), status: 'draft', attachments: [] },
];
export const MOCK_TIERS: Tier[] = [
  { id: 't1', creatorId: 'c1', name: 'Explorer', price: 9, benefits: ['Access to basic posts', 'Community chat access', 'Monthly newsletter'] },
  { id: 't2', creatorId: 'c1', name: 'Creator Pro', price: 29, benefits: ['All Explorer benefits', 'Exclusive video tutorials', 'Source code downloads'] },
  { id: 't3', creatorId: 'c1', name: 'VIP Access', price: 99, benefits: ['All Creator Pro benefits', 'Monthly 1-on-1 call', 'Early access to content'] },
];
export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Jane Subscriber',
  avatar: 'https://i.pravatar.cc/150?u=janesub',
};
export const MOCK_SUBSCRIPTION: Subscription = {
  id: 'sub1',
  userId: 'u1',
  creatorId: 'c1',
  tierId: 't2',
  active: true,
};
export let MOCK_USER_TOKENS: UserTokens = {
  userId: 'u1',
  balance: 1250,
};
export let MOCK_TOKEN_TRANSACTIONS: TokenTransaction[] = [
  { id: 'tx1', userId: 'u1', amount: 500, reason: 'Token Purchase', ts: new Date('2023-10-25') },
  { id: 'tx2', userId: 'u1', creatorId: 'c1', amount: -50, reason: 'Tip for "SaaS with CF" post', ts: new Date('2023-10-26') },
  { id: 'tx3', userId: 'u1', amount: 1000, reason: 'Token Purchase', ts: new Date('2023-10-22') },
];
export const MOCK_TOP_TIPPERS = [
    { user: { id: 'u2', name: 'Bob Fan', avatar: 'https://i.pravatar.cc/150?u=bobfan' }, amount: 500 },
    { user: { id: 'u3', name: 'Charlie Supporter', avatar: 'https://i.pravatar.cc/150?u=charlie' }, amount: 250 },
    { user: { id: 'u4', name: 'Diana Enthusiast', avatar: 'https://i.pravatar.cc/150?u=diana' }, amount: 100 },
];
export const MOCK_ANALYTICS_DATA = {
  earnings: [
    { month: 'Jan', earnings: 1200 },
    { month: 'Feb', earnings: 1800 },
    { month: 'Mar', earnings: 1500 },
    { month: 'Apr', earnings: 2200 },
    { month: 'May', earnings: 2500 },
    { month: 'Jun', earnings: 3100 },
  ],
  subscribers: [
    { month: 'Jan', subscribers: 150 },
    { month: 'Feb', subscribers: 210 },
    { month: 'Mar', subscribers: 240 },
    { month: 'Apr', subscribers: 300 },
    { month: 'May', subscribers: 350 },
    { month: 'Jun', subscribers: 420 },
  ],
  topContent: MOCK_CONTENT_ITEMS.slice(0, 3).map((item, i) => ({
    ...item,
    views: 1500 - i * 300,
    earnings: (1500 - i * 300) * 0.5,
  })),
};