import { Badge } from "@/components/ui/badge";
import { Calendar, Activity, Database } from "lucide-react";

interface StatusBarProps {
  lastUpdated: string;
  isOnline: boolean;
  activeSensors: number;
}

export function StatusBar({ lastUpdated, isOnline, activeSensors }: StatusBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-600">System Status:</span>
            <Badge variant={isOnline ? "success" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Live Data
            </Badge>
            <span className="text-blue-600 font-medium">{activeSensors.toLocaleString()} Active Sensors</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-600">
            <Database className="h-4 w-4" />
            <Activity className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
