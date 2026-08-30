export async function apiPost<T = any>(_e: string, _d: Record<string, any>): Promise<T> { return { success: true } as T; }
export async function apiGet<T = any>(_e: string): Promise<T> { return null as T; }
export async function apiGetClient<T = any>(_e: string): Promise<T> { return null as T; }