// DUMMY DATA FILE FOR MOHALI - TO BE REMOVED WHEN REAL API IS INTEGRATED
// This file contains mock GPS coordinates and pothole data for Mohali
// Replace this entire file with real API calls when backend is ready

import type { PotholeLocation } from './dummyMapData';

// Mohali city center coordinates: 30.7046, 76.7179
// These are realistic coordinates within Mohali sectors and areas
export const DUMMY_MOHALI_POTHOLES: PotholeLocation[] = [
  // Phase 3B2 (Main Area)
  {
    id: 'MOH_001',
    latitude: 30.7125,
    longitude: 76.7245,
    severity: 'high',
    timestamp: '2025-09-01T08:45:00Z',
    description: 'Large pothole near Phase 3B2 market',
    repairStatus: 'pending'
  },
  {
    id: 'MOH_002',
    latitude: 30.7138,
    longitude: 76.7268,
    severity: 'medium',
    timestamp: '2025-09-01T09:30:00Z',
    description: 'Road damage on residential street',
    repairStatus: 'scheduled'
  },

  // Phase 7 (Industrial Area)
  {
    id: 'MOH_003',
    latitude: 30.6845,
    longitude: 76.6925,
    severity: 'high',
    timestamp: '2025-09-01T10:15:00Z',
    description: 'Cluster of potholes in industrial zone',
    repairStatus: 'pending'
  },
  {
    id: 'MOH_004',
    latitude: 30.6858,
    longitude: 76.6948,
    severity: 'low',
    timestamp: '2025-09-01T11:20:00Z',
    description: 'Minor surface damage',
    repairStatus: 'completed'
  },

  // Phase 1 (Old Mohali)
  {
    id: 'MOH_005',
    latitude: 30.7285,
    longitude: 76.7158,
    severity: 'medium',
    timestamp: '2025-09-01T12:35:00Z',
    description: 'Pothole affecting school route',
    repairStatus: 'in_progress'
  },
  {
    id: 'MOH_006',
    latitude: 30.7298,
    longitude: 76.7142,
    severity: 'high',
    timestamp: '2025-09-01T13:40:00Z',
    description: 'Deep pothole near hospital',
    repairStatus: 'pending'
  },

  // Phase 8 (New Development)
  {
    id: 'MOH_007',
    latitude: 30.6785,
    longitude: 76.6845,
    severity: 'medium',
    timestamp: '2025-09-01T14:25:00Z',
    description: 'Road surface deterioration',
    repairStatus: 'scheduled'
  },
  {
    id: 'MOH_008',
    latitude: 30.6798,
    longitude: 76.6862,
    severity: 'low',
    timestamp: '2025-09-01T15:10:00Z',
    description: 'Small pothole on new road',
    repairStatus: 'completed'
  },

  // Phase 5 (Commercial Hub)
  {
    id: 'MOH_009',
    latitude: 30.7045,
    longitude: 76.7085,
    severity: 'high',
    timestamp: '2025-09-01T16:50:00Z',
    description: 'Major pothole in shopping area',
    repairStatus: 'pending'
  },

  // Phase 9 (Residential)
  {
    id: 'MOH_010',
    latitude: 30.6925,
    longitude: 76.7225,
    severity: 'medium',
    timestamp: '2025-09-01T17:35:00Z',
    description: 'Pothole affecting residential access',
    repairStatus: 'scheduled'
  },

  // Sector 68 (IT City)
  {
    id: 'MOH_011',
    latitude: 30.6754,
    longitude: 76.7456,
    severity: 'high',
    timestamp: '2025-09-01T18:20:00Z',
    description: 'Multiple potholes in IT corridor',
    repairStatus: 'pending'
  },

  // Phase 11 (Outer Area)
  {
    id: 'MOH_012',
    latitude: 30.6685,
    longitude: 76.6785,
    severity: 'medium',
    timestamp: '2025-09-01T19:05:00Z',
    description: 'Pothole on connecting road',
    repairStatus: 'in_progress'
  },

  // Additional Phase 3B1
  {
    id: 'MOH_013',
    latitude: 30.7185,
    longitude: 76.7195,
    severity: 'low',
    timestamp: '2025-09-01T20:15:00Z',
    description: 'Minor road issue near park',
    repairStatus: 'completed'
  },

  // Phase 6 (Mixed Development)
  {
    id: 'MOH_014',
    latitude: 30.6965,
    longitude: 76.7125,
    severity: 'medium',
    timestamp: '2025-09-01T21:30:00Z',
    description: 'Road damage from monsoon',
    repairStatus: 'scheduled'
  },

  // Airport Road Connection
  {
    id: 'MOH_015',
    latitude: 30.6825,
    longitude: 76.6685,
    severity: 'high',
    timestamp: '2025-09-01T22:45:00Z',
    description: 'Critical pothole on airport route',
    repairStatus: 'pending'
  }
];

// Mohali map center and bounds (restricted to city limits)
export const MOHALI_MAP_CONFIG = {
  center: {
    lat: 30.7046,
    lng: 76.7179
  },
  zoom: 13,
  bounds: {
    north: 30.7400,  // Northern boundary
    south: 30.6600,  // Southern boundary  
    east: 76.7600,   // Eastern boundary
    west: 76.6600    // Western boundary
  }
};

// Combined data for "Both" view
export const COMBINED_MAP_CONFIG = {
  center: {
    lat: 30.7190,  // Between Mohali and Chandigarh
    lng: 76.7487
  },
  zoom: 12,
  bounds: {
    north: 30.7650,
    south: 30.6600,
    east: 76.8150,
    west: 76.6600
  }
};
