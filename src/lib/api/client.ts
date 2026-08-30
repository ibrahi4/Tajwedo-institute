class ApiClient {
  async post(endpoint: string, data?: Record<string, any>) {
    const route = endpoint.startsWith('/api') ? endpoint : '/api' + endpoint;
    const res = await fetch(route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });
    return await res.json();
  }
  async get(_endpoint: string, _params?: any) { return { data: [], success: true }; }
  async patch(_endpoint: string, _data?: any) { return null; }
  async put(_endpoint: string, _data?: any) { return null; }
  async del(_endpoint: string) { return null; }
}
export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
export const api = new ApiClient();
export default api;