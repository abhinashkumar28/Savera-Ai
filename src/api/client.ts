// Savera AI API Client
// Supports both demo mode (localStorage) and real backend API

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
const DEMO_MODE = (import.meta as any).env?.VITE_DEMO_MODE !== 'false'; // Default to demo mode

interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('savera_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('savera_token', token);
    } else {
      localStorage.removeItem('savera_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============ AUTH ============
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string, role?: string) {
    return this.request<{ message: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  // ============ BUILDINGS ============
  async getBuildings() {
    return this.request<any[]>('/buildings');
  }

  async createBuilding(data: any) {
    return this.request<any>('/buildings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============ ENERGY READINGS ============
  async getReadings(params?: { buildingId?: string; startDate?: string; endDate?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/readings${query ? `?${query}` : ''}`);
  }

  async importReadings(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/readings/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Import failed');
    return response.json();
  }

  async simulateReadings(days: number = 30, buildingIds?: string[]) {
    return this.request<{ message: string; count: number }>('/readings/simulate', {
      method: 'POST',
      body: JSON.stringify({ days, buildingIds }),
    });
  }

  // ============ ANOMALIES ============
  async detectAnomalies(buildingId?: string, hours: number = 24) {
    return this.request<{ count: number; anomalies: any[] }>('/anomalies/detect', {
      method: 'POST',
      body: JSON.stringify({ buildingId, hours }),
    });
  }

  async getAnomalies(params?: { buildingId?: string; severity?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/anomalies${query ? `?${query}` : ''}`);
  }

  async updateAnomalyStatus(id: string, status: string, notes?: string) {
    return this.request<any>(`/anomalies/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // ============ RECOMMENDATIONS ============
  async getRecommendations(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/recommendations${query ? `?${query}` : ''}`);
  }

  async updateRecommendationStatus(id: string, status: string) {
    return this.request<any>(`/recommendations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ============ TASKS ============
  async getTasks(params?: { assigneeId?: string; status?: string; buildingId?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/tasks${query ? `?${query}` : ''}`);
  }

  async createTask(data: any) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: any) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============ SMS ============
  async createSMSCampaign(data: { buildingId: string; message: string; senderId: string; templateId?: string }) {
    return this.request<any>('/sms/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSMSCampaigns() {
    return this.request<any[]>('/sms/campaigns');
  }

  // ============ CONTACTS ============
  async getContacts(buildingId?: string) {
    const query = buildingId ? `?buildingId=${buildingId}` : '';
    return this.request<any[]>(`/contacts${query}`);
  }

  async createContact(data: any) {
    return this.request<any>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============ REPORTS ============
  async getReportSummary(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.request<any>(`/reports/summary${params.toString() ? `?${params}` : ''}`);
  }

  // ============ SETTINGS ============
  async getThresholds() {
    return this.request<any[]>('/settings/thresholds');
  }

  async createThreshold(data: any) {
    return this.request<any>('/settings/thresholds', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============ AUDIT LOGS ============
  async getAuditLogs(limit: number = 100) {
    return this.request<any[]>(`/audit-logs?limit=${limit}`);
  }

  // ============ HEALTH ============
  async healthCheck() {
    return this.request<{ status: string }>('/health');
  }
}

export const api = new ApiClient();
export default api;
