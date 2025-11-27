/**
 * API Service Layer - Abstraction for Mock/Real API Integration
 * Designed for seamless transition from mock data to production API
 * All endpoints follow RESTful conventions with error handling
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ApiConfig {
  baseUrl: string;
  useMockData: boolean;
  timeout: number;
}

class ApiService {
  private config: ApiConfig;
  private mockDelayMs: number = 300; // Simulate network latency

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || process.env.REACT_APP_API_URL || 'https://api.policywall.gr',
      useMockData: config.useMockData !== false, // Default to mock
      timeout: config.timeout || 30000
    };
  }

  /**
   * Set API mode (mock vs. real)
   */
  setMockMode(enabled: boolean) {
    this.config.useMockData = enabled;
    console.log(`API Service: ${enabled ? 'MOCK' : 'REAL'} mode enabled`);
  }

  /**
   * Generic fetch with mock fallback
   */
  private async fetchWithMock<T>(
    endpoint: string,
    options: RequestInit = {},
    mockData: T | null = null
  ): Promise<ApiResponse<T>> {
    if (this.config.useMockData && mockData) {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, this.mockDelayMs));
      return {
        success: true,
        data: mockData,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `API Error: ${response.status} ${response.statusText}`,
          timestamp: new Date().toISOString()
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ==================== PROFILE ENDPOINTS ====================

  /**
   * GET /api/profile/:userId
   */
  async getUserProfile(userId: string, mockData: any = null) {
    return this.fetchWithMock(
      `/api/profile/${userId}`,
      { method: 'GET' },
      mockData
    );
  }

  /**
   * POST /api/profile
   */
  async createUserProfile(profile: any) {
    return this.fetchWithMock(
      '/api/profile',
      {
        method: 'POST',
        body: JSON.stringify(profile)
      },
      profile // Mock response
    );
  }

  /**
   * PUT /api/profile/:userId
   */
  async updateUserProfile(userId: string, updates: any) {
    return this.fetchWithMock(
      `/api/profile/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates)
      },
      { id: userId, ...updates }
    );
  }

  // ==================== HEALTH ENDPOINTS ====================

  /**
   * GET /api/health/checkups/:userId
   */
  async getHealthCheckups(userId: string, mockData: any[] = []) {
    return this.fetchWithMock(
      `/api/health/checkups/${userId}`,
      { method: 'GET' },
      mockData
    );
  }

  /**
   * POST /api/health/checkups
   */
  async createHealthCheckup(checkup: any) {
    return this.fetchWithMock(
      '/api/health/checkups',
      {
        method: 'POST',
        body: JSON.stringify(checkup)
      },
      { id: Date.now().toString(), ...checkup }
    );
  }

  /**
   * GET /api/health/metrics/:checkupId
   */
  async getHealthMetrics(checkupId: string, mockData: any = {}) {
    return this.fetchWithMock(
      `/api/health/metrics/${checkupId}`,
      { method: 'GET' },
      mockData
    );
  }

  /**
   * POST /api/health/metrics
   */
  async createHealthMetrics(metrics: any) {
    return this.fetchWithMock(
      '/api/health/metrics',
      {
        method: 'POST',
        body: JSON.stringify(metrics)
      },
      { id: Date.now().toString(), ...metrics }
    );
  }

  /**
   * GET /api/health/risk-assessment/:userId
   */
  async getRiskAssessment(userId: string, mockData: any = {}) {
    return this.fetchWithMock(
      `/api/health/risk-assessment/${userId}`,
      { method: 'GET' },
      mockData
    );
  }

  /**
   * POST /api/health/risk-assessment
   */
  async calculateRiskAssessment(assessment: any) {
    return this.fetchWithMock(
      '/api/health/risk-assessment',
      {
        method: 'POST',
        body: JSON.stringify(assessment)
      },
      { id: Date.now().toString(), ...assessment }
    );
  }

  /**
   * GET /api/health/recommendations/:userId
   */
  async getRecommendations(userId: string, mockData: any[] = []) {
    return this.fetchWithMock(
      `/api/health/recommendations/${userId}`,
      { method: 'GET' },
      mockData
    );
  }

  /**
   * POST /api/health/recommendations
   */
  async createRecommendation(recommendation: any) {
    return this.fetchWithMock(
      '/api/health/recommendations',
      {
        method: 'POST',
        body: JSON.stringify(recommendation)
      },
      { id: Date.now().toString(), ...recommendation }
    );
  }

  /**
   * PATCH /api/health/recommendations/:id/complete
   */
  async completeRecommendation(id: string, mockData: any = {}) {
    return this.fetchWithMock(
      `/api/health/recommendations/${id}/complete`,
      { method: 'PATCH' },
      { ...mockData, completedAt: new Date().toISOString() }
    );
  }

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * GET /api/admin/stats
   */
  async getAdminStats(mockData: any = {}) {
    return this.fetchWithMock(
      '/api/admin/stats',
      { method: 'GET' },
      mockData
    );
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Batch fetch multiple endpoints
   */
  async batchFetch(requests: Array<{ endpoint: string; method?: string; mockData?: any }>) {
    return Promise.all(
      requests.map(req =>
        this.fetchWithMock(req.endpoint, { method: req.method || 'GET' }, req.mockData)
      )
    );
  }
}

// Export singleton instance
export const apiService = new ApiService({
  useMockData: true // Start with mock data by default
});

// Export class for testing/custom instances
export default ApiService;
