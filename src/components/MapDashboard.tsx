import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle } from "lucide-react";
import { UnifiedMap } from "./UnifiedMap";
import type { SensorData } from "@/data/mockData";

interface MapDashboardProps {
  sensorData: SensorData[];
}

export function MapDashboard({ sensorData }: MapDashboardProps) {
  const criticalRoads = sensorData.filter(sensor => sensor.severity === 'high');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Interactive Road Quality Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UnifiedMap />
          </CardContent>
        </Card>
      </div>

      {/* Priority Repair Roads */}
      <div>
        <Card>
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
                  <p className="text-xs text-gray-600">{road.zone} • {road.potholes} potholes</p>
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
