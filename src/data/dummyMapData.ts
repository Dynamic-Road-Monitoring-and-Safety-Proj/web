// DUMMY DATA FILE - TO BE REMOVED WHEN REAL API IS INTEGRATED
// This file contains mock GPS coordinates and pothole data
// Replace this entire file with real API calls when backend is ready

export interface PotholeLocation {
  id: string;
  latitude: number;
  longitude: number;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  videoUrl?: string; // For future video integration
  imuData?: {
    accelerometer: { x: number; y: number; z: number };
    gyroscope: { x: number; y: number; z: number };
  };
  description: string;
  repairStatus: 'pending' | 'scheduled' | 'in_progress' | 'completed';
}

// Sample pothole data
export const DUMMY_CHANDIGARH_POTHOLES: PotholeLocation[] = [
  {
    id: 'POT_001',
    latitude: 30.7411,
    longitude: 76.7755,
    severity: 'high',
    timestamp: '2025-09-01T08:30:00Z',
    description: 'Large pothole near city center',
    repairStatus: 'pending'
  },
  {
    id: 'POT_002',
    latitude: 30.7418,
    longitude: 76.7802,
    severity: 'medium',
    timestamp: '2025-09-01T09:15:00Z',
    description: 'Medium pothole on main road',
    repairStatus: 'scheduled'
  },
  {
    id: 'POT_003',
    latitude: 30.7302,
    longitude: 76.7751,
    severity: 'high',
    timestamp: '2025-09-01T10:20:00Z',
    description: 'Cluster of potholes near market area',
    repairStatus: 'pending'
  },
  {
    id: 'POT_004',
    latitude: 30.7289,
    longitude: 76.7688,
    severity: 'low',
    timestamp: '2025-09-01T11:00:00Z',
    description: 'Small road surface issue',
    repairStatus: 'completed'
  },
  {
    id: 'POT_005',
    latitude: 30.7355,
    longitude: 76.7825,
    severity: 'medium',
    timestamp: '2025-09-01T12:30:00Z',
    description: 'Medium severity pothole',
    repairStatus: 'in_progress'
  }
];

export const CHANDIGARH_MAP_CONFIG = {
  center: {
    lat: 30.7333,
    lng: 76.7794
  },
  zoom: 13,
  bounds: {
    north: 30.7650,
    south: 30.6950,
    east: 76.8150,
    west: 76.7200
  }
};
