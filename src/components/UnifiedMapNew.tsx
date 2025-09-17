import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Badge } from '@/components/ui/badge';
import type { PotholeLocation } from '@/types';
import 'leaflet/dist/leaflet.css';

// Temporary empty data while we migrate to real API data
const DUMMY_CHANDIGARH_POTHOLES: PotholeLocation[] = [];
const DUMMY_MOHALI_POTHOLES: PotholeLocation[] = [];
const COMBINED_MAP_CONFIG = {
  center: [30.7333, 76.7794] as [number, number],
  zoom: 12
};
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
      border: 2px solid #ffffff;
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
  className?: string;
}

export function UnifiedMap({ className }: UnifiedMapProps) {
  // Combine all pothole data for general view
  const potholeData = [
    ...DUMMY_CHANDIGARH_POTHOLES,
    ...DUMMY_MOHALI_POTHOLES
  ];

  // Use combined map config for general view
  const mapConfig = COMBINED_MAP_CONFIG;
  
  const getSeverityStats = () => {
    const stats = potholeData.reduce((acc: any, pothole) => {
      acc[pothole.severity]++;
      return acc;
    }, { high: 0, medium: 0, low: 0 });
    
    return stats;
  };

  const stats = getSeverityStats();

  return (
    <div className={`${className || ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Road Quality Map</h3>
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
      
      <div className="h-96 w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={mapConfig.center}
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
              icon={createCustomIcon(pothole.severity)}
              eventHandlers={{
                click: () => {
                  // Handle pothole selection if needed
                  console.log('Pothole selected:', pothole);
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-sm">{pothole.description}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={pothole.severity as any} className="text-xs">
                      {pothole.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Status: {pothole.repairStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(pothole.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
