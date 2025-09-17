import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon, Icon } from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { sensorDataApi, ApiError } from '@/services/api';
import type { SensorData, PotholeLocation } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

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

// Transform sensor data to pothole location format
const transformSensorDataToPotholeLocation = (sensor: SensorData): PotholeLocation => ({
  id: sensor.id,
  latitude: Number(sensor.latitude),
  longitude: Number(sensor.longitude),
  severity: sensor.severity,
  timestamp: sensor.timestamp,
  description: `${sensor.pothole_count} potholes detected on ${sensor.road_name} (RQI: ${sensor.rqi})`,
  repairStatus: sensor.repair_status,
});

interface UnifiedMapProps {
  className?: string;
}

export function UnifiedMap({ className }: UnifiedMapProps) {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSensorData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading sensor data for map...');
        const response = await sensorDataApi.getAll();
        console.log('Sensor data loaded:', response.data.length, 'records');
        setSensorData(response.data);
      } catch (err) {
        console.error('Failed to load sensor data:', err);
        if (err instanceof ApiError) {
          setError(`API Error: ${err.message}`);
        } else {
          setError('Failed to load map data');
        }
      } finally {
        setLoading(false);
      }
    };

    loadSensorData();
  }, []);

  // Transform sensor data to pothole locations
  const potholeData = sensorData
    .map(transformSensorDataToPotholeLocation)
    .filter(pothole => {
      // Filter out invalid coordinates
      const lat = Number(pothole.latitude);
      const lng = Number(pothole.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

  // Map configuration - center between Mohali and Chandigarh
  const mapConfig = {
    center: [30.7333, 76.7794] as [number, number], // Chandigarh center
    zoom: 11,
    bounds: [
      [30.6500, 76.6500], // Southwest
      [30.8000, 76.9000]  // Northeast
    ] as [[number, number], [number, number]]
  };

  if (loading) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600">Error loading map: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  try {
    return (
      <div className={`relative ${className}`}>
        <MapContainer
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          style={{ height: '500px', width: '100%' }}
          className="rounded-lg shadow-lg"
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
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">Road Issue</h3>
                    <Badge 
                      variant={pothole.severity === 'high' ? 'destructive' : 
                              pothole.severity === 'medium' ? 'default' : 'secondary'}
                    >
                      {pothole.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {pothole.description}
                  </p>
                
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>ID: {pothole.id}</div>
                    <div>Status: <span className="capitalize">{pothole.repairStatus}</span></div>
                    <div>Detected: {new Date(pothole.timestamp).toLocaleDateString()}</div>
                    <div>Location: {Number(pothole.latitude).toFixed(6)}, {Number(pothole.longitude).toFixed(6)}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
          <h4 className="font-semibold text-sm mb-2">Severity Levels</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-full mr-2 border border-white" 
                style={{ backgroundColor: getSeverityColor('high') }}
              ></div>
              High Risk
            </div>
            <div className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-full mr-2 border border-white" 
                style={{ backgroundColor: getSeverityColor('medium') }}
              ></div>
              Medium Risk
            </div>
            <div className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-full mr-2 border border-white" 
                style={{ backgroundColor: getSeverityColor('low') }}
              ></div>
              Low Risk
            </div>
          </div>
          <div className="mt-2 pt-2 border-t text-xs text-gray-500">
            Total Issues: {potholeData.length}
          </div>
        </div>
      </div>
    );
  } catch (mapError) {
    console.error('Map rendering error:', mapError);
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <p className="text-yellow-800">Map failed to render. Please refresh the page.</p>
        <p className="text-sm text-yellow-600 mt-1">Error: {mapError instanceof Error ? mapError.message : 'Unknown error'}</p>
      </div>
    );
  }
}
