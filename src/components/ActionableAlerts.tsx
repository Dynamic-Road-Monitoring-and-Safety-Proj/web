import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";
import type { SensorData, AlertData } from "@/types";

interface ActionableAlertsProps {
  priorityRoads: SensorData[];
  alerts: AlertData[];
  className?: string;
}

export default function ActionableAlerts({
  priorityRoads = [],
  alerts = [],
  className
}: ActionableAlertsProps) {
  // Combine and prioritize items
  const combinedItems = [
    // High priority roads (converted to alert format)
    ...priorityRoads.slice(0, 4).map(road => ({
      id: road.id,
      type: 'road_repair',
      message: `${road.road_name} - RQI: ${road.rqi}/100`,
      timestamp: new Date().toISOString(),
      priority: road.rqi < 30 ? 3 : road.rqi < 50 ? 2 : 1,
      location: road.road_name,
      severity: road.rqi < 30 ? 'high' : road.rqi < 50 ? 'medium' : 'low'
    })),
    // Recent alerts
    ...alerts.slice(0, 3).map(alert => ({
      id: alert.id,
      type: alert.type,
      message: alert.description,
      timestamp: alert.timestamp,
      priority: alert.severity === 'high' ? 3 : alert.severity === 'medium' ? 2 : 1,
      location: alert.location,
      severity: alert.severity
    }))
  ].sort((a, b) => b.priority - a.priority).slice(0, 5);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'road_repair':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'weather':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'low':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className={`h-full ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Priority Actions Required</span>
            <Badge variant="destructive" className="text-xs">
              {combinedItems.length}
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            View All
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 overflow-y-auto">
        {combinedItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No urgent actions required</p>
          </div>
        ) : (
          combinedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {item.location}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                    {/* Action buttons for road repair items */}
                    {item.type === 'road_repair' && (
                      <div className="flex space-x-2 mt-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="text-xs h-7 px-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                        >
                          Schedule Repair
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-7 px-2 text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                  <Badge 
                    className={`text-xs ml-2 ${getSeverityColor(item.severity)}`}
                    variant="secondary"
                  >
                    {item.severity}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
