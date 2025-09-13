import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import type { TrendData } from "@/data/mockData";

interface ChartsGridProps {
  trendData: TrendData[];
}

export function ChartsGrid({ trendData }: ChartsGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Pothole Detection Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Pothole Detection Trend</span>
            </CardTitle>
            <div className="flex space-x-2 text-sm">
              <Button variant="outline" size="sm" className="bg-red-500 text-white border-red-500">
                Trends
              </Button>
              <Button variant="outline" size="sm">Seasonal</Button>
              <Button variant="outline" size="sm">Repairs</Button>
              <Button variant="outline" size="sm">Distribution</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
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
                <Line 
                  type="monotone" 
                  dataKey="potholes" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>2025-08-06</span>
            <span>2025-08-12</span>
            <span>2025-08-18</span>
            <span>2025-08-24</span>
            <span>2025-09-01</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
