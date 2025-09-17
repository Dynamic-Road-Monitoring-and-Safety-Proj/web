// API service functions for Road Quality Monitoring Dashboard
// Handles all communication with the FastAPI backend

import type {
  SensorData,
  AlertData,
  TrendData,
  MunicipalityInfo,
  DashboardStats,
  ApiResponse,
  City
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

console.log('API_BASE_URL:', API_BASE_URL); // Debug log

class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Fetching:', url); // Debug log
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('API Error:', response.status, errorData); // Debug log
      throw new ApiError(response.status, errorData.detail || 'Request failed');
    }
    
    const data = await response.json();
    console.log('API Response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Fetch error:', error); // Debug log
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    console.error('API request failed:', error);
    throw new ApiError(0, 'Network error - please check if the backend server is running');
  }
}

// Sensor Data API
export const sensorDataApi = {
  // Get all sensor data
  getAll: async (): Promise<ApiResponse<SensorData>> => {
    return fetchApi<ApiResponse<SensorData>>('/sensor-data');
  },

  // Get sensor data filtered by city
  getByCity: async (city: City): Promise<ApiResponse<SensorData>> => {
    return fetchApi<ApiResponse<SensorData>>(`/sensor-data?city=${encodeURIComponent(city)}`);
  },
};

// Alerts API
export const alertsApi = {
  // Get all alerts
  getAll: async (): Promise<ApiResponse<AlertData>> => {
    return fetchApi<ApiResponse<AlertData>>('/alerts');
  },

  // Get alerts filtered by city
  getByCity: async (city: City): Promise<ApiResponse<AlertData>> => {
    return fetchApi<ApiResponse<AlertData>>(`/alerts?city=${encodeURIComponent(city)}`);
  },

  // Get alerts filtered by status
  getByStatus: async (status: string): Promise<ApiResponse<AlertData>> => {
    return fetchApi<ApiResponse<AlertData>>(`/alerts?status=${encodeURIComponent(status)}`);
  },

  // Get alerts filtered by city and status
  getByCityAndStatus: async (city: City, status: string): Promise<ApiResponse<AlertData>> => {
    return fetchApi<ApiResponse<AlertData>>(`/alerts?city=${encodeURIComponent(city)}&status=${encodeURIComponent(status)}`);
  },
};

// Trend Data API
export const trendsApi = {
  // Get trend data for specified number of days
  get: async (days: number = 30): Promise<ApiResponse<TrendData>> => {
    return fetchApi<ApiResponse<TrendData>>(`/trends?days=${days}`);
  },

  // Get trend data filtered by city
  getByCity: async (city: City, days: number = 30): Promise<ApiResponse<TrendData>> => {
    return fetchApi<ApiResponse<TrendData>>(`/trends?city=${encodeURIComponent(city)}&days=${days}`);
  },
};

// Municipality Info API
export const municipalityApi = {
  // Get all municipality information
  getAll: async (): Promise<ApiResponse<MunicipalityInfo>> => {
    return fetchApi<ApiResponse<MunicipalityInfo>>('/municipalities');
  },

  // Get municipality info filtered by city
  getByCity: async (city: City): Promise<ApiResponse<MunicipalityInfo>> => {
    return fetchApi<ApiResponse<MunicipalityInfo>>(`/municipalities?city=${encodeURIComponent(city)}`);
  },
};

// Dashboard Stats API
export const dashboardApi = {
  // Get aggregated dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    return fetchApi<DashboardStats>('/dashboard-stats');
  },
};

// Combined API for common dashboard needs
export const dashboardDataApi = {
  // Get all data needed for dashboard initialization
  getAllDashboardData: async () => {
    try {
      const [stats, sensors, alerts, trends, municipalities] = await Promise.all([
        dashboardApi.getStats(),
        sensorDataApi.getAll(),
        alertsApi.getAll(),
        trendsApi.get(30),
        municipalityApi.getAll(),
      ]);

      return {
        stats,
        sensors: sensors.data,
        alerts: alerts.data,
        trends: trends.data,
        municipalities: municipalities.data,
      };
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      throw error;
    }
  },

  // Get city-specific dashboard data
  getCityDashboardData: async (city: City) => {
    try {
      const [sensors, alerts, trends, municipalities] = await Promise.all([
        sensorDataApi.getByCity(city),
        alertsApi.getByCity(city),
        trendsApi.getByCity(city, 30),
        municipalityApi.getByCity(city),
      ]);

      return {
        sensors: sensors.data,
        alerts: alerts.data,
        trends: trends.data,
        municipalities: municipalities.data,
      };
    } catch (error) {
      console.error(`Failed to load ${city} dashboard data:`, error);
      throw error;
    }
  },
};

// Utility functions for data processing
export const dataUtils = {
  // Filter high priority sensor data
  getHighPrioritySensors: (sensors: SensorData[]): SensorData[] => {
    return sensors
      .filter(sensor => sensor.severity === 'high')
      .sort((a, b) => b.priority - a.priority);
  },

  // Filter active alerts
  getActiveAlerts: (alerts: AlertData[]): AlertData[] => {
    return alerts.filter(alert => alert.status === 'active');
  },

  // Get recent trend data (last 7 days)
  getRecentTrends: (trends: TrendData[]): TrendData[] => {
    return trends
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  },

  // Calculate average RQI for a city
  calculateAverageRQI: (sensors: SensorData[]): number => {
    if (sensors.length === 0) return 0;
    const total = sensors.reduce((sum, sensor) => sum + sensor.rqi, 0);
    return Math.round((total / sensors.length) * 10) / 10;
  },
};

// Export API error class for error handling
export { ApiError };
