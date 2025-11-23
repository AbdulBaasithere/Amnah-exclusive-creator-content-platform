import { ApiResponse } from "../../shared/types"
import * as mock from "shared/mock-data";
const MOCK_DELAY = 500;
// Phase 1: Mock API client that falls back to mock data
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  console.log(`[API Client] Requesting: ${path}`);
  // Mock routes for Phase 1
  if (path.startsWith('/api/creator/')) {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    const creatorId = path.split('/')[3];
    if (creatorId === mock.MOCK_CREATOR.id) {
      return {
        creator: mock.MOCK_CREATOR,
        content: mock.MOCK_CONTENT_ITEMS,
        tiers: mock.MOCK_TIERS,
      } as T;
    }
  }
  if (path === '/api/dashboard') {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    return {
        creator: mock.MOCK_CREATOR,
        content: mock.MOCK_CONTENT_ITEMS,
        tiers: mock.MOCK_TIERS,
        topTippers: mock.MOCK_TOP_TIPPERS,
    } as T;
  }
  if (path === '/api/tokens') {
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    return {
        balance: mock.MOCK_USER_TOKENS.balance,
        transactions: mock.MOCK_TOKEN_TRANSACTIONS,
    } as T;
  }
  // Fallback to actual fetch for other routes
  try {
    const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...init });
    const json = (await res.json()) as ApiResponse<T>;
    if (!res.ok || !json.success || json.data === undefined) {
      throw new Error(json.error || 'Request failed');
    }
    return json.data;
  } catch (error) {
    console.error(`[API Client] Fetch failed for ${path}:`, error);
    // In a real app, you might want to throw a more specific error
    // or handle it based on the error type.
    throw error;
  }
}