# Road Quality Monitoring Dashboard - Data Schema Documentation

## Overview
This document defines the CSV data schema required for the Road Quality Monitoring Dashboard. The dashboard monitors road conditions in Mohali and Chandigarh using sensor data, alerts, and trend analytics.

## CSV File Structure

### 1. Sensor Data (`sensor_data.csv`)
**Purpose**: Core sensor readings from road monitoring devices
**Location**: `backend/uploads/csv/sensor_data.csv`

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | string | Unique sensor reading identifier | SEN_MOH_001_20250901_073639 |
| timestamp | ISO 8601 | When the reading was taken | 2025-09-01T07:36:39Z |
| latitude | decimal | GPS latitude coordinate | 30.7046 |
| longitude | decimal | GPS longitude coordinate | 76.7179 |
| city | string | City name (Mohali/Chandigarh) | Mohali |
| zone | string | Specific area/sector within city | Industrial Area Phase 1 |
| road_name | string | Name of the road | Phase 1 Main Road |
| rqi | integer | Road Quality Index (0-100, lower is worse) | 24 |
| pothole_count | integer | Number of potholes detected | 7 |
| severity | string | Severity level (low/medium/high) | high |
| priority | integer | Repair priority (1-5, 5 is highest) | 5 |
| repair_status | string | Current status (pending/scheduled/in_progress/completed) | pending |
| surface_roughness | decimal | Surface roughness measurement | 2.5 |
| crack_density | decimal | Crack density per square meter | 1.8 |
| water_damage | boolean | Water damage detected (true/false) | true |

### 2. Alerts Data (`alerts.csv`)
**Purpose**: System-generated alerts for road conditions
**Location**: `backend/uploads/csv/alerts.csv`

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | string | Unique alert identifier | ALT_001_20250901 |
| type | string | Alert type (critical_road/deteriorating_trend/sensor_cluster) | critical_road |
| title | string | Alert title | Critical Road Condition Detected |
| description | string | Detailed alert description | Multiple severe potholes detected on Phase 1 Main Road |
| city | string | City name (Mohali/Chandigarh) | Mohali |
| location | string | Specific location description | Industrial Area Phase 1, Main Road |
| latitude | decimal | GPS latitude coordinate | 30.7046 |
| longitude | decimal | GPS longitude coordinate | 76.7179 |
| severity | string | Alert severity (high/medium/low) | high |
| priority | integer | Priority level (1-5, 5 is highest) | 5 |
| timestamp | ISO 8601 | When alert was generated | 2025-09-01T07:36:39Z |
| status | string | Alert status (active/acknowledged/resolved) | active |
| affected_sensors | integer | Number of sensors involved | 3 |

### 3. Trend Data (`trend_data.csv`)
**Purpose**: Historical trend data for analytics charts
**Location**: `backend/uploads/csv/trend_data.csv`

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| date | date | Date of the trend data | 2025-09-01 |
| city | string | City name (Mohali/Chandigarh) | Mohali |
| potholes_detected | integer | Total potholes detected that day | 45 |
| repairs_completed | integer | Total repairs completed that day | 12 |
| average_rqi | decimal | Average Road Quality Index for the day | 68.5 |
| active_alerts | integer | Number of active alerts | 8 |
| sensors_active | integer | Number of active sensors | 156 |
| road_coverage_km | decimal | Total road coverage in kilometers | 245.8 |

### 4. Municipality Info (`municipality_info.csv`)
**Purpose**: Static information about municipalities and zones
**Location**: `backend/uploads/csv/municipality_info.csv`

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | string | Unique municipality zone identifier | MOH_PHASE1 |
| city | string | City name (Mohali/Chandigarh) | Mohali |
| zone_name | string | Zone/sector name | Industrial Area Phase 1 |
| zone_type | string | Type of zone (residential/commercial/industrial) | industrial |
| total_roads_km | decimal | Total road length in kilometers | 12.5 |
| population | integer | Approximate population in zone | 15000 |
| priority_level | integer | Maintenance priority (1-5) | 4 |
| maintenance_budget | decimal | Annual maintenance budget | 500000 |
| last_major_repair | date | Date of last major road repair | 2024-03-15 |

## Data Requirements

### Minimum Data Volume
- **Sensor Data**: At least 500 records across both cities
- **Alerts**: At least 50 active alerts
- **Trend Data**: 30 days of historical data
- **Municipality Info**: Complete coverage of all zones

### Geographic Coverage
- **Mohali**: Industrial areas, residential phases, commercial zones
- **Chandigarh**: All major sectors (17, 22, 35, etc.)
- **Coordinates**: Realistic GPS coordinates within city boundaries

### Data Quality Requirements
1. **Timestamps**: All timestamps in UTC ISO 8601 format
2. **Coordinates**: Valid GPS coordinates within city boundaries
3. **IDs**: Unique, descriptive identifiers following naming conventions
4. **Consistency**: Consistent city names, zone names, and enum values
5. **Relationships**: Proper relationships between alerts and sensor data

## API Endpoints Required

### Backend Endpoints to Implement
1. `GET /api/sensor-data` - Retrieve all sensor data
2. `GET /api/sensor-data/{city}` - Get sensor data for specific city
3. `GET /api/alerts` - Retrieve all alerts
4. `GET /api/alerts/{city}` - Get alerts for specific city  
5. `GET /api/trends` - Retrieve trend data
6. `GET /api/trends/{city}` - Get trends for specific city
7. `GET /api/municipalities` - Get municipality information

## Frontend Integration

### Required Changes
1. Remove all files from `src/data/` directory
2. Create `src/types/` directory with TypeScript interfaces
3. Create `src/services/` directory with API service functions
4. Update all components to use API calls instead of mock data
5. Add error handling and loading states for API calls

### Environment Configuration
```typescript
// Frontend environment variables needed
VITE_API_BASE_URL=http://localhost:8000/api
```

## File Naming Conventions
- Use lowercase with underscores: `sensor_data.csv`
- Include date suffixes for time-series data when relevant
- Keep file names descriptive and consistent

## Data Update Frequency
- **Sensor Data**: Real-time (as sensors report)
- **Alerts**: Real-time (as conditions change)
- **Trend Data**: Daily aggregation
- **Municipality Info**: Static (updated quarterly)
