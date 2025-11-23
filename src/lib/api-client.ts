import { ApiResponse } from "@shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    const json = (await res.json()) as ApiResponse<T>;
    if (!res.ok || !json.success || json.data === undefined) {
      throw new Error(json.error || 'Request failed with status ' + res.status);
    }
    return json.data;
  } catch (error) {
    console.error(`[API Client] Fetch failed for ${path}:`, error);
    // Re-throw the error so react-query can handle it
    throw error;
  }
}