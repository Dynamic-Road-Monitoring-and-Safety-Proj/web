import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  MapPin
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
}

function StatsCard({ title, value, icon, description, priority }: StatsCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {priority && (
          <div className="absolute top-2 right-2">
            <Badge variant={priority === 'high' ? 'high' : priority === 'medium' ? 'medium' : 'low'} className="text-xs">
              {priority}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    totalSensors: number;
    activeSensors: number;
    sensorsChange: number;
    potholesDetected: number;
    potholesChange: number;
    averageRqi: number;
    rqiChange: number;
    criticalRoads: number;
    criticalChange: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Sensors Active"
        value={stats.totalSensors}
        icon={<Activity className="h-4 w-4" />}
        description={`${stats.activeSensors.toLocaleString()} currently active`}
      />
      
      <StatsCard
        title="Potholes Detected"
        value={stats.potholesDetected}
        icon={<MapPin className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Average RQI"
        value={stats.averageRqi}
        icon={<TrendingUp className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Critical Roads"
        value={stats.criticalRoads}
        icon={<AlertTriangle className="h-4 w-4" />}
      />
    </div>
  );
}
