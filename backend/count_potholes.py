#!/usr/bin/env python3

import csv
import os
from collections import defaultdict

def count_potholes():
    csv_dir = '/Users/raghav_sarna/Desktop/Drive/Plaksha/Semester 5/ILGC/Web/backend/uploads/csv'
    files = [f for f in os.listdir(csv_dir) if f.endswith('.csv')]
    
    total_potholes = 0
    date_potholes = defaultdict(int)
    
    for file_name in sorted(files):
        file_path = os.path.join(csv_dir, file_name)
        print(f"\nProcessing {file_name}:")
        
        file_potholes = 0
        with open(file_path, 'r') as file:
            csv_reader = csv.DictReader(file)
            for row_num, row in enumerate(csv_reader, 1):
                pothole_count = int(float(row['Pothole']))
                file_potholes += pothole_count
                
                # Extract date from timestamp
                timestamp = row['Time']
                if ':' in timestamp and 'T' not in timestamp and len(timestamp.split(':')) == 3:
                    from datetime import date
                    today = date.today()
                    timestamp = f"{today}T{timestamp}Z"
                
                date_str = timestamp[:10]
                date_potholes[date_str] += pothole_count
                
                if row_num <= 3:  # Show first 3 rows
                    print(f"  Row {row_num}: Potholes = {pothole_count}")
        
        print(f"  File total: {file_potholes} potholes")
        total_potholes += file_potholes
    
    print(f"\n=== SUMMARY ===")
    print(f"Total potholes across all files: {total_potholes}")
    print(f"\nPotholes by date:")
    for date_str in sorted(date_potholes.keys()):
        print(f"  {date_str}: {date_potholes[date_str]} potholes")

if __name__ == "__main__":
    count_potholes()