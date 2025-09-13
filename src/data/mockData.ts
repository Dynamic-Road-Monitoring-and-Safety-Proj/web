// Mock data for the Road Quality Monitoring Dashboard

export interface SensorData {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  zone: string;
  roadName: string;
  rqi: number; // Road Quality Index (0-100)
  potholes: number;
  severity: 'low' | 'medium' | 'high';
  priority: 1 | 2 | 3 | 4 | 5;
  repairStatus: 'pending' | 'scheduled' | 'in_progress' | 'completed';
}

export interface AlertData {
  id: string;
  type: 'critical_road' | 'deteriorating_trend' | 'sensor_cluster';
  title: string;
  description: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  priority: 1 | 2 | 3 | 4 | 5;
}

export interface TrendData {
  date: string;
  potholes: number;
  repairs: number;
  rqi: number;
}

// Mock sensor data for the dashboard
export const mockSensorData: SensorData[] = [
  {
    id: '1',
    timestamp: '2025-09-01T07:36:39Z',
    latitude: 30.7046,
    longitude: 76.7179,
    zone: 'Industrial Area Phase 1',
    roadName: 'Industrial Area Phase 1',
    rqi: 24,
    potholes: 7,
    severity: 'high',
    priority: 5,
    repairStatus: 'pending'
  },
  {
    id: '2',
    timestamp: '2025-09-01T06:36:39Z',
    latitude: 30.7333,
    longitude: 76.7794,
    zone: 'Phase 3',
    roadName: 'Phase 3B2 Main Road',
    rqi: 45,
    potholes: 8,
    severity: 'medium',
    priority: 4,
    repairStatus: 'scheduled'
  },
  {
    id: '3',
    timestamp: '2025-09-01T05:36:39Z',
    latitude: 30.7333,
    longitude: 76.7794,
    zone: 'Sector 15',
    roadName: 'Jan Marg',
    rqi: 42,
    potholes: 9,
    severity: 'medium',
    priority: 4,
    repairStatus: 'in_progress'
  },
  // Add more sensor points for the heatmap
  ...generateRandomSensorData(50)
];

function generateRandomSensorData(count: number): SensorData[] {
  const data: SensorData[] = [];
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Sector 1', 'Sector 2', 'Phase 1', 'Phase 2', 'Phase 3'];

  for (let i = 4; i <= count + 3; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const baseLatLng = { lat: 30.7190, lng: 76.7486 }; // General central coordinates

    const rqi = Math.floor(Math.random() * 100);
    const potholes = Math.floor(Math.random() * 15);
    
    data.push({
      id: i.toString(),
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      latitude: baseLatLng.lat + (Math.random() - 0.5) * 0.1,
      longitude: baseLatLng.lng + (Math.random() - 0.5) * 0.1,
      zone,
      roadName: `Road ${i} ${zone}`,
      rqi,
      potholes,
      severity: rqi < 30 ? 'high' : rqi < 60 ? 'medium' : 'low',
      priority: rqi < 20 ? 5 : rqi < 40 ? 4 : rqi < 60 ? 3 : rqi < 80 ? 2 : 1,
      repairStatus: Math.random() > 0.7 ? 'completed' : Math.random() > 0.4 ? 'scheduled' : 'pending'
    });
  }

  return data;
}

// Mock alerts data
export const mockAlerts: AlertData[] = [
  {
    id: 'alert-1',
    type: 'critical_road',
    title: 'Critical Road Condition',
    description: 'Industrial Area Phase 1 - Multiple potholes detected',
    location: 'Zone A, Phase 1',
    severity: 'high',
    timestamp: '2025-09-01T07:21:39Z',
    priority: 5
  },
  {
    id: 'alert-2',
    type: 'deteriorating_trend',
    title: 'Deteriorating Trend',
    description: 'Airport Road showing 40% increase in pothole density',
    location: 'Zone B, Phase 2',
    severity: 'medium',
    timestamp: '2025-09-01T06:21:39Z',
    priority: 3
  },
  {
    id: 'alert-3',
    type: 'sensor_cluster',
    title: 'Sensor Cluster Alert',
    description: '12 potholes detected in Sector 22 within last 2 hours',
    location: 'Zone C, Sector 22',
    severity: 'high',
    timestamp: '2025-09-01T05:21:39Z',
    priority: 4
  }
];

// Mock trend data for charts
export const mockTrendData: TrendData[] = [
  { date: '2025-08-06', potholes: 45, repairs: 12, rqi: 65 },
  { date: '2025-08-08', potholes: 42, repairs: 15, rqi: 68 },
  { date: '2025-08-12', potholes: 38, repairs: 18, rqi: 72 },
  { date: '2025-08-15', potholes: 44, repairs: 14, rqi: 69 },
  { date: '2025-08-18', potholes: 40, repairs: 16, rqi: 71 },
  { date: '2025-08-21', potholes: 35, repairs: 20, rqi: 74 },
  { date: '2025-08-24', potholes: 48, repairs: 10, rqi: 66 },
  { date: '2025-08-27', potholes: 52, repairs: 8, rqi: 62 },
  { date: '2025-09-01', potholes: 100, repairs: 5, rqi: 58 }
];

// Dashboard summary stats
export const dashboardStats = {
  totalSensors: 5000,
  activeSensors: 2487,
  sensorsChange: 2.5,
  potholesDetected: 1473,
  potholesChange: -11.8,
  averageRqi: 63,
  rqiChange: 3.2,
  criticalRoads: 1,
  criticalChange: -1,
  alerts: mockAlerts.length,
  newPotholes24h: 23,
  repairsDone24h: 7,
  systemEfficiency: 94.2
};
