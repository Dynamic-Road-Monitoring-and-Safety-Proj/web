// DUMMY DATA FILE - TO BE REMOVED WHEN REAL API IS INTEGRATED
// This file contains mock GPS coordinates and pothole data for Chandigarh
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

// Chandigarh city center coordinates: 30.7333, 76.7794
// These are realistic coordinates within Chandigarh sectors
export const DUMMY_CHANDIGARH_POTHOLES: PotholeLocation[] = [
  // Sector 17 (City Center)
  {
    id: 'CHD_001',
    latitude: 30.7411,
    longitude: 76.7755,
    severity: 'high',
    timestamp: '2025-09-01T08:30:00Z',
    description: 'Large pothole near Sector 17 Plaza',
    repairStatus: 'pending'
  },
  {
    id: 'CHD_002',
    latitude: 30.7418,
    longitude: 76.7802,
    severity: 'medium',
    timestamp: '2025-09-01T09:15:00Z',
    description: 'Medium pothole on main road',
    repairStatus: 'scheduled'
  },
  
  // Sector 22
  {
    id: 'CHD_003',
    latitude: 30.7302,
    longitude: 76.7751,
    severity: 'high',
    timestamp: '2025-09-01T10:20:00Z',
    description: 'Cluster of potholes near Sector 22 market',
    repairStatus: 'pending'
  },
  {
    id: 'CHD_004',
    latitude: 30.7315,
    longitude: 76.7738,
    severity: 'low',
    timestamp: '2025-09-01T11:05:00Z',
    description: 'Small pothole on residential road',
    repairStatus: 'completed'
  },
  
  // Sector 35
  {
    id: 'CHD_005',
    latitude: 30.7176,
    longitude: 76.7553,
    severity: 'medium',
    timestamp: '2025-09-01T12:10:00Z',
    description: 'Pothole affecting traffic flow',
    repairStatus: 'in_progress'
  },
  {
    id: 'CHD_006',
    latitude: 30.7189,
    longitude: 76.7571,
    severity: 'high',
    timestamp: '2025-09-01T13:25:00Z',
    description: 'Deep pothole near bus stop',
    repairStatus: 'pending'
  },
  
  // Sector 43
  {
    id: 'CHD_007',
    latitude: 30.7012,
    longitude: 76.7588,
    severity: 'medium',
    timestamp: '2025-09-01T14:15:00Z',
    description: 'Road damage from heavy vehicles',
    repairStatus: 'scheduled'
  },
  
  // Sector 8
  {
    id: 'CHD_008',
    latitude: 30.7521,
    longitude: 76.7874,
    severity: 'low',
    timestamp: '2025-09-01T15:30:00Z',
    description: 'Minor road surface issue',
    repairStatus: 'completed'
  },
  
  // Panchkula Road
  {
    id: 'CHD_009',
    latitude: 30.7458,
    longitude: 76.8012,
    severity: 'high',
    timestamp: '2025-09-01T16:45:00Z',
    description: 'Major pothole on highway connection',
    repairStatus: 'pending'
  },
  
  // Sector 26
  {
    id: 'CHD_010',
    latitude: 30.7255,
    longitude: 76.7895,
    severity: 'medium',
    timestamp: '2025-09-01T17:20:00Z',
    description: 'Pothole near educational institutions',
    repairStatus: 'scheduled'
  },
  
  // Sector 34
  {
    id: 'CHD_011',
    latitude: 30.7198,
    longitude: 76.7452,
    severity: 'high',
    timestamp: '2025-09-01T18:10:00Z',
    description: 'Multiple potholes affecting commute',
    repairStatus: 'pending'
  },
  
  // IT Park Area
  {
    id: 'CHD_012',
    latitude: 30.7089,
    longitude: 76.7234,
    severity: 'medium',
    timestamp: '2025-09-01T19:15:00Z',
    description: 'Pothole in commercial area',
    repairStatus: 'in_progress'
  }
];

// Chandigarh map center and bounds (restricted to city limits)
export const CHANDIGARH_MAP_CONFIG = {
  center: {
    lat: 30.7333,
    lng: 76.7794
  },
  zoom: 13,
  bounds: {
    north: 30.7650,  // Northern boundary (more restrictive)
    south: 30.6950,  // Southern boundary (more restrictive)
    east: 76.8150,   // Eastern boundary (more restrictive)
    west: 76.7200    // Western boundary (more restrictive)
  }
};

// Future API integration structure (commented out for now)
/*
export interface APIResponse {
  potholes: Array<{
    id: string;
    coordinates: { lat: number; lng: number };
    severity: string;
    timestamp: string;
    videoUrl: string;
    csvData: {
      accelerometer: { x: number; y: number; z: number };
      gyroscope: { x: number; y: number; z: number };
      timestamp: string;
    }[];
  }>;
}

// Future API calls
export const fetchPotholeData = async (): Promise<APIResponse> => {
  // Will replace dummy data with real API call
  const response = await fetch('/api/potholes/chandigarh');
  return response.json();
};
*/
