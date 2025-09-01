import { useState } from 'react';
import './App.css';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { DashboardStats } from '@/components/DashboardStats';
import { MapDashboard } from '@/components/MapDashboard';
import { AlertsPanel } from '@/components/AlertsPanel';
import { ChartsGrid } from '@/components/ChartsGrid';
import { Sidebar } from '@/components/Sidebar';
import { 
  mockSensorData, 
  mockAlerts, 
  mockTrendData, 
  dashboardStats 
} from '@/data/mockData';

function App() {
  const [selectedCity, setSelectedCity] = useState<'Both' | 'Mohali' | 'Chandigarh'>('Both');
  
  // Filter priority roads (high severity)
  const priorityRoads = mockSensorData
    .filter(sensor => sensor.severity === 'high')
    .sort((a, b) => b.priority - a.priority);

  const sidebarStats = {
    newPotholes24h: dashboardStats.newPotholes24h,
    repairsDone24h: dashboardStats.repairsDone24h,
    systemEfficiency: dashboardStats.systemEfficiency
  };

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
        <div className="mb-8">
          <DashboardStats stats={dashboardStats} />
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map Dashboard */}
            <MapDashboard 
              sensorData={mockSensorData}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />

            {/* Charts */}
            <ChartsGrid trendData={mockTrendData} />

            {/* Alerts */}
            <AlertsPanel alerts={mockAlerts} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar priorityRoads={priorityRoads} stats={sidebarStats} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
