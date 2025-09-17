import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { TrendingUp } from "lucide-react";
// Legacy interface for backward compatibility with existing ChartGrid component
interface LegacyTrendData {
  date: string;
  potholes: number;
  repairs: number;
  rqi: number;
}

interface ChartsGridProps {
  trendData: LegacyTrendData[];
}

type ChartMetric = 'potholes' | 'repairs' | 'rqi';

export function ChartsGrid({ trendData }: ChartsGridProps) {
  const [activeMetrics, setActiveMetrics] = useState<ChartMetric[]>(['potholes', 'repairs']);

  // Debug: Log the data to ensure it's correct
  console.log('Chart trendData:', trendData);
  console.log('Active metrics:', activeMetrics);

  const toggleMetric = (metric: ChartMetric) => {
    setActiveMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const getButtonVariant = (metric: ChartMetric) => {
    return activeMetrics.includes(metric) ? "default" : "outline";
  };

  const getButtonClasses = (metric: ChartMetric) => {
    if (activeMetrics.includes(metric)) {
      switch (metric) {
        case 'potholes':
          return "bg-red-500 text-white border-red-500 hover:bg-red-600";
        case 'repairs':
          return "bg-green-500 text-white border-green-500 hover:bg-green-600";
        case 'rqi':
          return "bg-blue-500 text-white border-blue-500 hover:bg-blue-600";
        default:
          return "";
      }
    }
    return "hover:bg-gray-50";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Detection & Repair Trends</span>
          </CardTitle>
          <div className="flex space-x-2 text-sm">
            <Button 
              variant={getButtonVariant('potholes')}
              size="sm" 
              className={getButtonClasses('potholes')}
              onClick={() => toggleMetric('potholes')}
            >
              Potholes Detected
            </Button>
            <Button 
              variant={getButtonVariant('repairs')}
              size="sm"
              className={getButtonClasses('repairs')}
              onClick={() => toggleMetric('repairs')}
            >
              Potholes Fixed
            </Button>
            <Button 
              variant={getButtonVariant('rqi')}
              size="sm"
              className={getButtonClasses('rqi')}
              onClick={() => toggleMetric('rqi')}
            >
              Road Quality Index
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-full" style={{ minHeight: '400px' }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              {activeMetrics.includes('potholes') && (
                <Line 
                  type="monotone" 
                  dataKey="potholes" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }}
                  name="Potholes Detected"
                />
              )}
              {activeMetrics.includes('repairs') && (
                <Line 
                  type="monotone" 
                  dataKey="repairs" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: '#fff' }}
                  name="Potholes Fixed"
                />
              )}
              {activeMetrics.includes('rqi') && (
                <Line 
                  type="monotone" 
                  dataKey="rqi" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                  name="Road Quality Index"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          {activeMetrics.includes('potholes') && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Potholes Detected</span>
            </div>
          )}
          {activeMetrics.includes('repairs') && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Potholes Fixed</span>
            </div>
          )}
          {activeMetrics.includes('rqi') && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Road Quality Index</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
