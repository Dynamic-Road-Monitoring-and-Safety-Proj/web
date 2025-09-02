import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { DUMMY_CHANDIGARH_POTHOLES, CHANDIGARH_MAP_CONFIG, type PotholeLocation } from '@/data/dummyMapData';
import 'leaflet/dist/leaflet.css';

// Create custom markers for different severity levels
const createCustomIcon = (severity: string) => {
  const color = getSeverityColor(severity);
  return divIcon({
    html: `<div style="
      background-color: ${color}; 
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 2px solid white;
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

interface ChandigarhMapProps {
  className?: string;
}

export function ChandigarhMapLeaflet({ className }: ChandigarhMapProps) {
  const [selectedPothole, setSelectedPothole] = useState<PotholeLocation | null>(null);
  
  const getSeverityStats = () => {
    const stats = DUMMY_CHANDIGARH_POTHOLES.reduce((acc, pothole) => {
      acc[pothole.severity]++;
      return acc;
    }, { high: 0, medium: 0, low: 0 });
    
    return stats;
  };

  const stats = getSeverityStats();

  return (
    <div className={`grid gap-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Chandigarh Pothole Map</span>
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
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full rounded-lg overflow-hidden border">
            <MapContainer
              center={[CHANDIGARH_MAP_CONFIG.center.lat, CHANDIGARH_MAP_CONFIG.center.lng]}
              zoom={CHANDIGARH_MAP_CONFIG.zoom}
              minZoom={11}
              maxZoom={16}
              maxBounds={[
                [CHANDIGARH_MAP_CONFIG.bounds.south, CHANDIGARH_MAP_CONFIG.bounds.west],
                [CHANDIGARH_MAP_CONFIG.bounds.north, CHANDIGARH_MAP_CONFIG.bounds.east]
              ]}
              maxBoundsViscosity={1.0}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {DUMMY_CHANDIGARH_POTHOLES.map((pothole) => (
                <Marker
                  key={pothole.id}
                  position={[pothole.latitude, pothole.longitude]}
                  icon={createCustomIcon(pothole.severity)}
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
                        <span className="text-xs text-gray-500">{pothole.id}</span>
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
            <p>Showing {DUMMY_CHANDIGARH_POTHOLES.length} pothole locations in Chandigarh</p>
            <p className="text-xs">🔴 Critical  🟠 Medium  🟢 Low Priority</p>
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
