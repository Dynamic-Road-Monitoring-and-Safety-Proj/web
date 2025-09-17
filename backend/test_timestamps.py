#!/usr/bin/env python3

import csv
import os
from datetime import datetime
from collections import defaultdict

def test_timestamp_parsing():
    csv_dir = '/Users/raghav_sarna/Desktop/Drive/Plaksha/Semester 5/ILGC/Web/backend/uploads/csv'
    files = [f for f in os.listdir(csv_dir) if f.endswith('.csv')]
    
    date_counts = defaultdict(int)
    
    for file_name in sorted(files):
        file_path = os.path.join(csv_dir, file_name)
        print(f"\nProcessing {file_name}:")
        
        with open(file_path, 'r') as file:
            csv_reader = csv.DictReader(file)
            for row_num, row in enumerate(csv_reader, 1):
                timestamp = row['Time']
                
                # Apply the same logic as in main.py
                if ':' in timestamp and 'T' not in timestamp and len(timestamp.split(':')) == 3:
                    from datetime import date
                    today = date.today()
                    timestamp = f"{today}T{timestamp}Z"
                
                # Parse the timestamp to extract date
                try:
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    date_str = dt.strftime('%Y-%m-%d')
                    date_counts[date_str] += 1
                    
                    if row_num <= 2:  # Show first 2 rows
                        print(f"  Row {row_num}: '{row['Time']}' -> '{timestamp}' -> {date_str}")
                except Exception as e:
                    print(f"  Row {row_num}: Error parsing '{timestamp}': {e}")
    
    print(f"\nDate distribution across all files:")
    for date_str in sorted(date_counts.keys()):
        print(f"  {date_str}: {date_counts[date_str]} records")
    
    print(f"\nTotal unique dates: {len(date_counts)}")

if __name__ == "__main__":
    test_timestamp_parsing()