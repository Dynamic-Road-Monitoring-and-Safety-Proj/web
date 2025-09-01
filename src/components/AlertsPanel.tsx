import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  TrendingDown, 
  Activity, 
  Clock, 
  MapPin, 
  Eye 
} from "lucide-react";
import type { AlertData } from "@/data/mockData";

const alertIcons = {
  critical_road: AlertTriangle,
  deteriorating_trend: TrendingDown,
  sensor_cluster: Activity,
};

const priorityColors = {
  5: "high",
  4: "high", 
  3: "medium",
  2: "low",
  1: "low"
} as const;

interface AlertsPanelProps {
  alerts: AlertData[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const sortedAlerts = [...alerts].sort((a, b) => b.priority - a.priority);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Active Alerts</span>
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All Priority Roads
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAlerts.map((alert) => {
          const IconComponent = alertIcons[alert.type];
          const priorityVariant = priorityColors[alert.priority as keyof typeof priorityColors];
          const timeAgo = getTimeAgo(alert.timestamp);
          
          return (
            <div 
              key={alert.id} 
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' 
                  ? 'bg-red-50 border-l-red-500' 
                  : alert.severity === 'medium'
                  ? 'bg-orange-50 border-l-orange-500'
                  : 'bg-yellow-50 border-l-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    alert.severity === 'high' 
                      ? 'bg-red-100 text-red-600' 
                      : alert.severity === 'medium'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <Badge variant={priorityVariant} className="text-xs">
                        Priority {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="ml-4">
                  Schedule Repair
                </Button>
              </div>
            </div>
          );
        })}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>No active alerts</p>
            <p className="text-sm">All roads are in good condition</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const alertTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
}
