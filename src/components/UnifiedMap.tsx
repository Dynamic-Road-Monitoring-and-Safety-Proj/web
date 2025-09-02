import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { 
  DUMMY_CHANDIGARH_POTHOLES, 
  CHANDIGARH_MAP_CONFIG, 
  type PotholeLocation 
} from '@/data/dummyMapData';
import { 
  DUMMY_MOHALI_POTHOLES, 
  MOHALI_MAP_CONFIG,
  COMBINED_MAP_CONFIG 
} from '@/data/dummyMohaliData';
import 'leaflet/dist/leaflet.css';

// Create custom markers for different severity levels
const createCustomIcon = (severity: string, city?: string) => {
  const color = getSeverityColor(severity);
  const borderColor = city === 'Mohali' ? '#3b82f6' : city === 'Chandigarh' ? '#10b981' : '#ffffff';
  
  return divIcon({
    html: `<div style="
      background-color: ${color}; 
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 2px solid ${borderColor};
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'high': return '#ef4444'; // Red
    case 'medium': return '#f97316'; // Orange
    case 'low': return '#22c55e'; // Green
    default: return '#6b7280'; // Gray
  }
};

interface UnifiedMapProps {
  selectedCity: 'Both' | 'Mohali' | 'Chandigarh';
  className?: string;
}

export function UnifiedMap({ selectedCity, className }: UnifiedMapProps) {
  const [selectedPothole, setSelectedPothole] = useState<PotholeLocation & { city?: string } | null>(null);
  
  // Get data based on selected city
  const getPotholeData = () => {
    switch (selectedCity) {
      case 'Chandigarh':
        return DUMMY_CHANDIGARH_POTHOLES.map(p => ({ ...p, city: 'Chandigarh' }));
      case 'Mohali':
        return DUMMY_MOHALI_POTHOLES.map(p => ({ ...p, city: 'Mohali' }));
      case 'Both':
        return [
          ...DUMMY_CHANDIGARH_POTHOLES.map(p => ({ ...p, city: 'Chandigarh' })),
          ...DUMMY_MOHALI_POTHOLES.map(p => ({ ...p, city: 'Mohali' }))
        ];
      default:
        return [];
    }
  };

  // Get map config based on selected city
  const getMapConfig = () => {
    switch (selectedCity) {
      case 'Chandigarh':
        return CHANDIGARH_MAP_CONFIG;
      case 'Mohali':
        return MOHALI_MAP_CONFIG;
      case 'Both':
        return COMBINED_MAP_CONFIG;
      default:
        return CHANDIGARH_MAP_CONFIG;
    }
  };

  const potholeData = getPotholeData();
  const mapConfig = getMapConfig();
  
  const getSeverityStats = () => {
    const stats = potholeData.reduce((acc, pothole) => {
      acc[pothole.severity]++;
      return acc;
    }, { high: 0, medium: 0, low: 0 });
    
    return stats;
  };

  const getCityStats = () => {
    if (selectedCity === 'Both') {
      const chandigarhCount = potholeData.filter(p => p.city === 'Chandigarh').length;
      const mohaliCount = potholeData.filter(p => p.city === 'Mohali').length;
      return { chandigarhCount, mohaliCount };
    }
    return null;
  };

  const stats = getSeverityStats();
  const cityStats = getCityStats();

  return (
    <div className={`grid gap-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{selectedCity} Road Quality Map</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Badge variant="high" className="text-xs">
                {stats.high} Critical
              </Badge>
              <Badge variant="medium" className="text-xs">
                {stats.medium} Medium
              </Badge>
              <Badge variant="low" className="text-xs">
                {stats.low} Low
              </Badge>
            </div>
          </div>
          {cityStats && (
            <div className="flex space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Chandigarh: {cityStats.chandigarhCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Mohali: {cityStats.mohaliCount}</span>
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full rounded-lg overflow-hidden border">
            <MapContainer
              center={[mapConfig.center.lat, mapConfig.center.lng]}
              zoom={mapConfig.zoom}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {potholeData.map((pothole) => (
                <Marker
                  key={pothole.id}
                  position={[pothole.latitude, pothole.longitude]}
                  icon={createCustomIcon(pothole.severity, pothole.city)}
                  eventHandlers={{
                    click: () => setSelectedPothole(pothole),
                  }}
                >
                  <Popup>
                    <div className="min-w-48">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant={pothole.severity as any}
                          className="text-xs capitalize"
                        >
                          {pothole.severity}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          {pothole.city && (
                            <Badge variant="outline" className="text-xs">
                              {pothole.city}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">{pothole.id}</span>
                        </div>
                      </div>
                      <p className="font-semibold text-sm mb-1">{pothole.description}</p>
                      <p className="text-xs text-gray-600 mb-2">
                        Status: <span className="capitalize">{pothole.repairStatus.replace('_', ' ')}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Detected: {new Date(pothole.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Showing {potholeData.length} pothole locations in {selectedCity}</p>
            <div className="flex justify-center items-center space-x-4 mt-1">
              <span className="text-xs">🔴 Critical  🟠 Medium  🟢 Low Priority</span>
              {selectedCity === 'Both' && (
                <span className="text-xs">🟢 Chandigarh  🔵 Mohali</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Pothole Details */}
      {selectedPothole && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pothole Details</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedPothole(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">ID:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedPothole.id}</code>
              </div>
              
              {selectedPothole.city && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">City:</span>
                  <Badge variant="outline" className="capitalize">
                    {selectedPothole.city}
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Severity:</span>
                <Badge 
                  variant={selectedPothole.severity as any}
                  className="capitalize"
                >
                  {selectedPothole.severity}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Location:</span>
                <span className="text-sm">
                  {selectedPothole.latitude.toFixed(6)}, {selectedPothole.longitude.toFixed(6)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant="outline" className="capitalize">
                  {selectedPothole.repairStatus.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="flex items-start justify-between">
                <span className="font-medium">Description:</span>
                <span className="text-sm text-right flex-1 ml-4">
                  {selectedPothole.description}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Detected:</span>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(selectedPothole.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                📹 Video data and IMU sensor data will be integrated when backend API is ready
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
