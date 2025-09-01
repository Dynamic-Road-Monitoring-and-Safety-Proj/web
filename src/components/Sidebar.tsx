import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import type { SensorData } from "@/data/mockData";

interface SidebarProps {
  priorityRoads: SensorData[];
  stats: {
    newPotholes24h: number;
    repairsDone24h: number;
    systemEfficiency: number;
  };
}

export function Sidebar({ priorityRoads, stats }: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Immediate Actions Required */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Immediate Actions Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {priorityRoads.slice(0, 3).map((road) => (
            <div key={road.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{road.roadName}</h4>
                <Badge variant="high" className="text-xs">
                  Priority {road.priority}
                </Badge>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{road.city} • RQI: {road.rqi} • {road.potholes} potholes</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-2 bg-red-600 hover:bg-red-700">
                Schedule Repair
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 24-Hour Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>24-Hour Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.newPotholes24h}</div>
                <div className="text-sm text-gray-600">New Potholes</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.repairsDone24h}</div>
                <div className="text-sm text-gray-600">Repairs Done</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.systemEfficiency}%</div>
              <div className="text-sm text-gray-600">System efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MapPin className="h-4 w-4 mr-2" />
            Add Sensor Location
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
