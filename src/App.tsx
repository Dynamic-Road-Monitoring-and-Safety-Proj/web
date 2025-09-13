import './App.css';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { DashboardStats } from '@/components/DashboardStats';
import { MapDashboard } from '@/components/MapDashboard';
import ActionableAlerts from '@/components/ActionableAlerts';
import { ChartsGrid } from '@/components/ChartsGrid';
import { 
  mockSensorData, 
  mockAlerts, 
  mockTrendData, 
  dashboardStats 
} from '@/data/mockData';

function App() {
  
  // Filter priority roads (high severity)
  const priorityRoads = mockSensorData
    .filter(sensor => sensor.severity === 'high')
    .sort((a, b) => b.priority - a.priority);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header alertCount={mockAlerts.length} />
      <StatusBar 
        lastUpdated="9/1/2025, 7:36:39 PM"
        isOnline={true}
        activeSensors={dashboardStats.activeSensors}
      />
      
      <main className="container mx-auto px-6 py-6">
        {/* Dashboard Stats */}
        <div className="mb-6">
          <DashboardStats stats={dashboardStats} />
        </div>

        {/* Map-First Layout - Map takes full width prominently */}
        <div className="space-y-6">
          {/* Full-width dominant map */}
          <div className="w-full">
            <MapDashboard />
          </div>

          {/* Bottom section with charts and alerts side by side */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Charts take 2 columns */}
            <div className="lg:col-span-2">
              <ChartsGrid trendData={mockTrendData} />
            </div>

            {/* Actionable Alerts take 1 column */}
            <div className="lg:col-span-1">
              <ActionableAlerts 
                priorityRoads={priorityRoads} 
                alerts={mockAlerts}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
