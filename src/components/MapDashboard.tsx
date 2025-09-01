import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Minus, RotateCcw, AlertTriangle } from "lucide-react";
import type { SensorData } from "@/data/mockData";

interface MapDashboardProps {
  sensorData: SensorData[];
  selectedCity: 'Both' | 'Mohali' | 'Chandigarh';
  onCityChange: (city: 'Both' | 'Mohali' | 'Chandigarh') => void;
}

export function MapDashboard({ sensorData, selectedCity, onCityChange }: MapDashboardProps) {
  const filteredData = selectedCity === 'Both' 
    ? sensorData 
    : sensorData.filter(sensor => sensor.city === selectedCity);

  const criticalRoads = filteredData.filter(sensor => sensor.severity === 'high');
  const averageRqi = Math.round(filteredData.reduce((sum, sensor) => sum + sensor.rqi, 0) / filteredData.length);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Interactive Road Quality Map</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={selectedCity === 'Both' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => onCityChange('Both')}
                >
                  Both
                </Button>
                <Button 
                  variant={selectedCity === 'Mohali' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => onCityChange('Mohali')}
                >
                  Mohali
                </Button>
                <Button 
                  variant={selectedCity === 'Chandigarh' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => onCityChange('Chandigarh')}
                >
                  Chandigarh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Placeholder for actual map - will be replaced with Leaflet */}
            <div className="h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto text-blue-400 mb-2" />
                <h3 className="text-lg font-semibold text-blue-600 mb-1">Interactive Map Loading...</h3>
                <p className="text-blue-500">Showing {filteredData.length} sensor points for {selectedCity}</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <Badge variant="high" className="text-xs">{criticalRoads.length} Critical</Badge>
                  <Badge variant="medium" className="text-xs">Avg RQI: {averageRqi}</Badge>
                </div>
              </div>
              
              {/* Map controls placeholder */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Minus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Time range controls */}
            <div className="mt-4 flex justify-center space-x-4">
              <Button variant="outline" size="sm" className="bg-blue-600 text-white border-blue-600">30d</Button>
              <Button variant="outline" size="sm">90d</Button>
              <Button variant="outline" size="sm">180d</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Performance Comparison */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>City Performance Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Mohali</span>
                <Badge variant="high" className="text-xs">RQI 58</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '58%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>752 potholes</span>
                <span>30% detection rate</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Chandigarh</span>
                <Badge variant="medium" className="text-xs">RQI 67</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>721 potholes</span>
                <span>29% detection rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Repair Roads */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Priority Repair Roads</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalRoads.slice(0, 3).map((road) => (
              <div key={road.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{road.roadName}</h4>
                  <p className="text-xs text-gray-600">{road.city} • {road.zone} • {road.potholes} potholes</p>
                </div>
                <div className="text-right">
                  <Badge variant="high" className="text-xs mb-1">RQI {road.rqi}</Badge>
                  <p className="text-xs text-gray-500">P{road.priority}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
