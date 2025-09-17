import './App.css';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { DashboardStats } from '@/components/DashboardStats';
import { MapDashboard } from '@/components/MapDashboard';
import { ChartsGrid } from '@/components/ChartsGrid';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useState, useEffect } from 'react';
import type { SensorData, AlertData, TrendData, DashboardStats as DashboardStatsType } from '@/types';
import { dashboardDataApi, dataUtils, ApiError } from '@/services/api';

// Temporary adapter for DashboardStats component until we update it
interface LegacyDashboardStats {
  totalSensors: number;
  activeSensors: number;
  sensorsChange: number;
  potholesDetected: number;
  potholesChange: number;
  averageRqi: number;
  rqiChange: number;
  criticalRoads: number;
  criticalChange: number;
}

// Temporary adapter for TrendData until we update ChartsGrid
interface LegacyTrendData {
  date: string;
  potholes: number;
  repairs: number;
  rqi: number;
}

function App() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType | null>(null);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [alertsData, setAlertsData] = useState<AlertData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await dashboardDataApi.getAllDashboardData();
        
        setDashboardStats(data.stats);
        setSensorData(data.sensors);
        setAlertsData(data.alerts);
        setTrendData(data.trends);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load dashboard data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeAlerts = dataUtils.getActiveAlerts(alertsData);

  // Adapt dashboard stats for legacy component
  const legacyStats: LegacyDashboardStats = {
    totalSensors: dashboardStats?.activeSensors || 0,
    activeSensors: dashboardStats?.activeSensors || 0,
    sensorsChange: 2, // Placeholder
    potholesDetected: sensorData.reduce((sum, sensor) => sum + sensor.pothole_count, 0),
    potholesChange: 15, // Placeholder
    averageRqi: dashboardStats?.averageRQI || 0,
    rqiChange: -3, // Placeholder
    criticalRoads: dashboardStats?.priorityIssues || 0,
    criticalChange: 1, // Placeholder
  };

  // Adapt trend data for legacy component
  const legacyTrends: LegacyTrendData[] = trendData.map(trend => ({
    date: trend.date,
    potholes: trend.potholes_detected,
    repairs: trend.repairs_completed,
    rqi: trend.average_rqi,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StatusBar 
        lastUpdated={dashboardStats?.lastUpdated ? new Date(dashboardStats.lastUpdated).toLocaleString() : 'Never'}
        isOnline={true}
        activeSensors={dashboardStats?.activeSensors || 0}
      />
      
      <main className="container mx-auto px-6 py-6">
        {/* Dashboard Stats */}
        <div className="mb-6">
          <DashboardStats stats={legacyStats} />
        </div>

        {/* Map-First Layout - Map takes full width prominently */}
        <div className="space-y-6">
          {/* Full-width dominant map */}
          <div className="w-full">
            <ErrorBoundary>
              <MapDashboard />
            </ErrorBoundary>
          </div>

          {/* Bottom section with charts and alerts side by side */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Charts take 2 columns */}
            <div className="lg:col-span-2">
              <ChartsGrid trendData={legacyTrends} />
            </div>

            {/* Alerts panel takes 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Active Alerts ({activeAlerts.length})</h3>
                {activeAlerts.length === 0 ? (
                  <p className="text-gray-500">No active alerts</p>
                ) : (
                  <div className="space-y-3">
                    {activeAlerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="border-l-4 border-red-500 pl-3">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs text-gray-600">{alert.location}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
