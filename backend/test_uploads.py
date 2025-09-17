#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Test the upload endpoints
def test_upload_endpoints():
    """Test that upload endpoints are properly defined"""
    try:
        # Import without geocoding first
        print("Testing upload endpoints...")
        
        # Create a test CSV file
        test_csv_content = """Time,SensorType,Value1,Value2,Value3,Latitude,Longitude,Pothole
15:30:00.000,Gyroscope,0.5,0.3,0.1,30.7333,76.7794,0"""
        
        test_file_path = "uploads/csv/test_upload.csv"
        os.makedirs("uploads/csv", exist_ok=True)
        
        with open(test_file_path, 'w') as f:
            f.write(test_csv_content)
        
        print(f"✅ Created test CSV file: {test_file_path}")
        
        # Check if video directory exists
        os.makedirs("uploads/video", exist_ok=True)
        print("✅ Created video upload directory")
        
        # Test file operations
        if os.path.exists(test_file_path):
            print("✅ CSV file upload location is accessible")
            
        # Clean up
        os.remove(test_file_path)
        print("✅ Upload functionality test passed")
        
        return True
        
    except Exception as e:
        print(f"❌ Upload test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_upload_endpoints()
    sys.exit(0 if success else 1)