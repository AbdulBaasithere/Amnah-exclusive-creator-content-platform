// Phase 1: In-memory mock data for CraftLedger
// --- TYPES ---
// Note: In a real app, these would be in shared/types.ts
export interface Creator {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  balance: number;
}
export interface ContentItem {
  id: string;
  creatorId: string;
  title: string;
  type: 'video' | 'download' | 'post';
  tierId: string;
  publishedAt: Date;
  status: 'published' | 'draft' | 'scheduled';
  attachments: { url: string; name: string }[];
}
export interface Tier {
  id: string;
  creatorId: string;
  name: string;
  price: number;
  benefits: string[];
}
export interface User {
  id: string;
  name:string;
  avatar: string;
}
export interface Subscription {
  userId: string;
  creatorId: string;
  tierId: string;
  active: boolean;
}
export interface UserTokens {
  userId: string;
  balance: number;
}
export interface TokenTransaction {
  id: string;
  userId: string;
  creatorId?: string;
  amount: number;
  reason: string;
  ts: Date;
}
// --- MOCK DATA ---
export const MOCK_CREATOR: Creator = {
  id: 'c1',
  name: 'Alex Dev',
  bio: 'Full-stack developer sharing tutorials on React, Node.js, and Cloudflare Workers. Join my community for exclusive content and source code!',
  avatar: 'https://i.pravatar.cc/150?u=alexdev',
  balance: 7450.50,
};
export let MOCK_CONTENT_ITEMS: ContentItem[] = [
  { id: 'content1', creatorId: 'c1', title: 'Building a SaaS with Cloudflare Workers', type: 'video', tierId: 't2', publishedAt: new Date('2023-10-26'), status: 'published', attachments: [] },
  { id: 'content2', creatorId: 'c1', title: 'Project Source Code: SaaS Boilerplate', type: 'download', tierId: 't2', publishedAt: new Date('2023-10-26'), status: 'published', attachments: [{ url: '#', name: 'source-code.zip' }] },
  { id: 'content3', creatorId: 'c1', title: 'Weekly Q&A Session', type: 'post', tierId: 't1', publishedAt: new Date('2023-10-20'), status: 'published', attachments: [] },
  { id: 'content4', creatorId: 'c1', title: 'Advanced Durable Objects Patterns', type: 'video', tierId: 't3', publishedAt: new Date('2023-11-05'), status: 'scheduled', attachments: [] },
  { id: 'content5', creatorId: 'c1', title: 'New Course Announcement (Draft)', type: 'post', tierId: 't1', publishedAt: new Date(), status: 'draft', attachments: [] },
];
export const MOCK_TIERS: Tier[] = [
  { id: 't1', creatorId: 'c1', name: 'Explorer', price: 9, benefits: ['Access to basic posts', 'Community chat access', 'Monthly newsletter'] },
  { id: 't2', creatorId: 'c1', name: 'Creator Pro', price: 29, benefits: ['All Explorer benefits', 'Exclusive video tutorials', 'Source code downloads'] },
  { id: 't3', creatorId: 'c1', name: 'VIP Access', price: 99, benefits: ['All Creator Pro benefits', 'Monthly 1-on-1 call', 'Early access to content'] },
];
export const MOCK_USER: User = {
  id: 'u1',
  name: 'Jane Subscriber',
  avatar: 'https://i.pravatar.cc/150?u=janesub',
};
export const MOCK_SUBSCRIPTION: Subscription = {
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
// --- MOCK API FUNCTIONS ---
export const addContentItem = (item: Omit<ContentItem, 'creatorId' | 'attachments'> & { attachments?: any[] }) => {
  const newItem: ContentItem = {
    ...item,
    creatorId: MOCK_CREATOR.id,
    attachments: item.attachments || [],
  };
  MOCK_CONTENT_ITEMS.unshift(newItem);
  return Promise.resolve(newItem);
};
export const addTokenTransaction = (tx: Omit<TokenTransaction, 'id'>) => {
    const newTx: TokenTransaction = { ...tx, id: `tx${Date.now()}` };
    MOCK_TOKEN_TRANSACTIONS.unshift(newTx);
    MOCK_USER_TOKENS.balance += tx.amount;
    return Promise.resolve(newTx);
}