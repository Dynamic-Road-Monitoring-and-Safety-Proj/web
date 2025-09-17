// TypeScript interfaces for Road Quality Monitoring Dashboard

export interface SensorData {
  id: string;
  timestamp: string; // ISO 8601 format
  sensor_type: string;
  latitude: number;
  longitude: number;
  pothole_count: number;
  rqi: number; // Road Quality Index (0-100)
  road_name: string;
  municipality: string;
  severity: 'low' | 'medium' | 'high';
  repair_status: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  priority: number; // 1-5
}

export interface AlertData {
  id: string;
  type: 'critical_road' | 'deteriorating_trend' | 'sensor_cluster';
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: 'high' | 'medium' | 'low';
  priority: number; // 1-5
  timestamp: string; // ISO 8601 format
  status: 'active' | 'acknowledged' | 'resolved';
  affected_sensors: number;
}

export interface TrendData {
  date: string; // YYYY-MM-DD format
  potholes_detected: number;
  repairs_completed: number;
  average_rqi: number;
  active_alerts: number;
  sensors_active: number;
  road_coverage_km: number;
}

export interface MunicipalityData {
  name: string;
  city: string;
  state: string;
  total_sensors: number;
  active_alerts: number;
  total_potholes: number;
}

export interface MunicipalityInfo {
  id: string;
  name: string;
  city: string;
  zone_name: string;
  zone_type: 'residential' | 'commercial' | 'industrial' | 'mixed' | 'government' | 'institutional' | 'recreational' | 'educational';
  total_roads_km: number;
  population: number;
  priority_level: number; // 1-5
  maintenance_budget: number;
  last_major_repair: string; // YYYY-MM-DD format
}

export interface DashboardStats {
  activeSensors: number;
  activeAlerts: number;
  averageRQI: number;
  priorityIssues: number;
  totalRoadCoverage: number;
  lastUpdated: string; // ISO 8601 format
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T[];
  count: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

// Map-related interfaces for backward compatibility
export interface PotholeLocation {
  id: string;
  latitude: number;
  longitude: number;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  description: string;
  repairStatus: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  videoUrl?: string;
  imuData?: {
    accelerometer: { x: number; y: number; z: number };
    gyroscope: { x: number; y: number; z: number };
  };
}

// Utility functions for data transformation
export const transformSensorDataToPotholeLocation = (sensor: SensorData): PotholeLocation => ({
  id: sensor.id,
  latitude: sensor.latitude,
  longitude: sensor.longitude,
  severity: sensor.severity,
  timestamp: sensor.timestamp,
  description: `${sensor.pothole_count} potholes detected on ${sensor.road_name}`,
  repairStatus: sensor.repair_status,
});

// City filter constants
export const CITIES = ['Mohali', 'Chandigarh'] as const;
export type City = typeof CITIES[number];

// Severity levels
export const SEVERITY_LEVELS = ['low', 'medium', 'high'] as const;
export type SeverityLevel = typeof SEVERITY_LEVELS[number];

// Repair status options
export const REPAIR_STATUS_OPTIONS = ['pending', 'scheduled', 'in_progress', 'completed'] as const;
export type RepairStatus = typeof REPAIR_STATUS_OPTIONS[number];

// Alert status options
export const ALERT_STATUS_OPTIONS = ['active', 'acknowledged', 'resolved'] as const;
export type AlertStatus = typeof ALERT_STATUS_OPTIONS[number];
