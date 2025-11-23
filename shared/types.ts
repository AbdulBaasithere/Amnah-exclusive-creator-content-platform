// --- TEMPLATE TYPES (DO NOT REMOVE) ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// --- CRAFTLEDGER APPLICATION TYPES ---
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
  description: string;
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
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}
export interface Subscription {
  id: string;
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