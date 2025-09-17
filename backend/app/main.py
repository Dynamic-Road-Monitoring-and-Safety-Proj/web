# Simple backend for sensor data processing
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import csv
import glob
from typing import List, Dict, Any, Optional
from datetime import datetime

# Environment variable to control geocoding
ENABLE_GEOCODING = os.getenv('ENABLE_GEOCODING', 'false').lower() == 'true'

# Import geocoding service
try:
    if ENABLE_GEOCODING:
        from geocoding import geocoding_service
        GEOCODING_AVAILABLE = True
        print("✅ Geocoding service loaded successfully")
    else:
        print("🔄 Geocoding disabled via environment variable")
        GEOCODING_AVAILABLE = False
        geocoding_service = None
except Exception as e:
    print(f"❌ Warning: Geocoding service not available - {e}")
    GEOCODING_AVAILABLE = False
    geocoding_service = None

app = FastAPI(title="Road Quality Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads", "csv")
VIDEO_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads", "video")

# Create directories if they don't exist
os.makedirs(CSV_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)

def get_all_sensor_files():
    pattern = os.path.join(CSV_DIR, "sensor_data_*.csv")
    files = glob.glob(pattern)
    if not files:
        raise HTTPException(status_code=404, detail="No sensor data files found")
    return sorted(files, key=os.path.getmtime)

async def read_sensor_data():
    files = get_all_sensor_files()
    all_data = []
    sensor_counter = 1
    geocoded_locations = {}  # Cache for geocoded coordinates
    
    for file_path in files:
        with open(file_path, 'r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                # Handle different time formats
                timestamp = row['Time']
                if ':' in timestamp and 'T' not in timestamp and len(timestamp.split(':')) == 3:
                    # Format like "14:54:15.260" - add today's date
                    from datetime import datetime, date
                    today = date.today()
                    timestamp = f"{today}T{timestamp}Z"
                
                # Calculate RQI using mean squared of sensor values (placeholder implementation)
                val1 = float(row.get('Value1', 0))
                val2 = float(row.get('Value2', 0)) 
                val3 = float(row.get('Value3', 0))
                
                # Mean squared RQI calculation
                # Calculate mean squared value and map to 1-10 scale
                mean_squared = (val1**2 + val2**2 + val3**2) / 3
                
                # Map mean squared to RQI scale (1-10, where 10 is best road quality)
                # Higher vibration = lower road quality
                if mean_squared < 0.1:
                    rqi = 9.5  # Excellent road
                elif mean_squared < 0.5:
                    rqi = 8.5  # Good road
                elif mean_squared < 1.0:
                    rqi = 7.0  # Fair road
                elif mean_squared < 2.0:
                    rqi = 5.5  # Poor road
                else:
                    rqi = 3.0  # Very poor road
                
                lat = float(row['Latitude'])
                lng = float(row['Longitude'])
                
                # Create a location key for caching (round to 4 decimal places)
                location_key = f"{round(lat, 4)},{round(lng, 4)}"
                
                # Use geocoding for road names with smart caching
                road_name = f"Road {sensor_counter}"
                municipality = 'Mohali Municipal Corporation' if lat < 30.75 else 'Chandigarh Municipal Corporation'
                
                if GEOCODING_AVAILABLE and geocoding_service and ENABLE_GEOCODING:
                    if location_key in geocoded_locations:
                        # Use cached result
                        cached_location = geocoded_locations[location_key]
                        road_name = cached_location.get('road', road_name)
                        municipality = cached_location.get('municipality', municipality)
                    elif len(geocoded_locations) < 20:  # Limit to 20 unique geocoding calls
                        try:
                            print(f"Geocoding location {len(geocoded_locations)+1}: {lat}, {lng}")
                            location = await geocoding_service.reverse_geocode(lat, lng)
                            geocoded_locations[location_key] = location
                            road_name = location.get('road', road_name)
                            municipality = location.get('municipality', municipality)
                        except Exception as e:
                            print(f"Geocoding failed for {lat}, {lng}: {e}")
                            # Store failed attempt to avoid retrying
                            geocoded_locations[location_key] = {'road': road_name, 'municipality': municipality}
                
                processed_row = {
                    'id': f"sensor_{sensor_counter}",
                    'timestamp': timestamp,
                    'sensor_type': row['SensorType'],
                    'latitude': lat,
                    'longitude': lng,
                    'pothole_count': int(float(row['Pothole'])),
                    'rqi': round(rqi, 2),
                    'road_name': road_name,
                    'municipality': municipality,
                    'severity': 'high' if rqi < 5.0 else ('medium' if rqi < 7.0 else 'low'),
                    'repair_status': 'detected'
                }
                all_data.append(processed_row)
                sensor_counter += 1
    
    print(f"Processed {len(all_data)} sensor records with {len(geocoded_locations)} unique locations geocoded")
    return all_data

@app.get("/api/sensor-data")
async def get_sensor_data():
    try:
        data = await read_sensor_data()
        return {"data": data, "count": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/alerts")
async def get_alerts():
    try:
        data = await read_sensor_data()
        alerts = []
        for i, item in enumerate(data):
            if item['severity'] in ['high', 'medium']:
                alert = {
                    'id': f"alert_{i + 1}",
                    'type': 'road_quality',
                    'title': f"Road Issue on {item['road_name']}",
                    'description': f"RQI: {item['rqi']}, Potholes: {item['pothole_count']}",
                    'severity': item['severity'],
                    'latitude': item['latitude'],
                    'longitude': item['longitude'],
                    'municipality': item['municipality'],
                    'timestamp': item['timestamp'],
                    'status': 'active',
                    'priority': 3 if item['severity'] == 'high' else 2
                }
                alerts.append(alert)
        return {"data": alerts, "count": len(alerts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trends")
async def get_trends():
    try:
        data = await read_sensor_data()
        # Group by date
        daily_stats = {}
        for item in data:
            date = item['timestamp'][:10]
            if date not in daily_stats:
                daily_stats[date] = {'potholes': 0, 'rqi_sum': 0, 'count': 0}
            daily_stats[date]['potholes'] += item['pothole_count']
            daily_stats[date]['rqi_sum'] += item['rqi']
            daily_stats[date]['count'] += 1
        
        trends = []
        for date, stats in daily_stats.items():
            trend = {
                'date': date,
                'potholes_detected': stats['potholes'],
                'repairs_completed': max(0, stats['potholes'] - 5),  # Simulated
                'average_rqi': round(stats['rqi_sum'] / stats['count'], 2),
                'active_alerts': stats['potholes'],
                'sensors_active': stats['count'],
                'road_coverage_km': round(stats['count'] * 0.1, 1)
            }
            trends.append(trend)
        
        return {"data": sorted(trends, key=lambda x: x['date']), "count": len(trends)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/municipalities")
async def get_municipalities():
    try:
        data = await read_sensor_data()
        municipalities = {
            'Mohali Municipal Corporation': {
                'name': 'Mohali Municipal Corporation',
                'city': 'Mohali',
                'state': 'Punjab',
                'total_sensors': 0,
                'active_alerts': 0,
                'total_potholes': 0
            },
            'Chandigarh Municipal Corporation': {
                'name': 'Chandigarh Municipal Corporation',
                'city': 'Chandigarh',
                'state': 'Chandigarh',
                'total_sensors': 0,
                'active_alerts': 0,
                'total_potholes': 0
            }
        }
        
        for item in data:
            muni = item['municipality']
            if muni in municipalities:
                municipalities[muni]['total_sensors'] += 1
                municipalities[muni]['total_potholes'] += item['pothole_count']
                if item['severity'] in ['high', 'medium']:
                    municipalities[muni]['active_alerts'] += 1
        
        return {"data": list(municipalities.values()), "count": len(municipalities)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard-stats")
async def get_dashboard_stats():
    try:
        data = await read_sensor_data()
        total_sensors = len(data)
        total_potholes = sum(item['pothole_count'] for item in data)
        active_alerts = len([item for item in data if item['severity'] in ['high', 'medium']])
        avg_rqi = sum(item['rqi'] for item in data) / len(data) if data else 0
        
        return {
            'total_sensors': total_sensors,
            'active_alerts': active_alerts,
            'total_potholes': total_potholes,
            'average_rqi': round(avg_rqi, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload/csv")
async def upload_csv_file(file: UploadFile = File(...)):
    """Upload a CSV file to the server"""
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
        file_location = os.path.join(CSV_DIR, file.filename)
        
        with open(file_location, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return JSONResponse(content={
            "message": "File uploaded successfully",
            "filename": file.filename,
            "size": len(content)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload/video")
async def upload_video_file(file: UploadFile = File(...)):
    """Upload a video file to the server"""
    try:
        allowed_extensions = ['.mp4', '.avi', '.mov', '.mkv']
        if not any(file.filename.endswith(ext) for ext in allowed_extensions):
            raise HTTPException(status_code=400, detail="Only video files are allowed")
        
        file_location = os.path.join(VIDEO_DIR, file.filename)
        
        with open(file_location, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return JSONResponse(content={
            "message": "Video uploaded successfully",
            "filename": file.filename,
            "size": len(content)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
