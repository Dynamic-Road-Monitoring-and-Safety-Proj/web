# FastAPI Backend

This backend provides two API endpoints for uploading CSV and video files. Uploaded files are saved locally in separate folders.

## Setup & Installation

1. **Install dependencies**

Navigate to the backend directory and install required packages:

```sh
cd backend/app
pip install fastapi uvicorn python-multipart
```

## Running the Backend

Start the FastAPI server:

```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- The server will be accessible at `http://<your-ip>:8000`
- Uploaded files will be saved in `backend/app/uploads/csv` and `backend/app/uploads/video`
- Get ip from `ipconfig getifaddr en0` (mac)

For ngrok:

```
ngrok http 8000
```

For LocalTunnel:
npm install -g localtunnel
lt --port 8000 --subdomain rstm  
output:
  ```your url is: https://rstm.loca.lt```
- visit the url and put host ip address as password
For IP run:
```curl -s https://ipv4.icanhazip.com```

## API Endpoints

### 1. Upload CSV
- **Endpoint:** `POST /upload/csv`
- **Form field:** `file` (CSV file)
- **Response:**
  ```json
  { "filename": "yourfile.csv", "saved_to": "uploads/csv/yourfile.csv" }
  ```

### 2. Upload Video
- **Endpoint:** `POST /upload/video`
- **Form field:** `file` (MP4, AVI, or MOV file)
- **Response:**
  ```json
  { "filename": "yourvideo.mp4", "saved_to": "uploads/video/yourvideo.mp4" }
  ```

## Example Usage (with curl)

Upload a CSV file:
```sh
curl -F "file=@yourfile.csv" http://<your-ip>:8000/upload/csv
```

Upload a video file:
```sh
curl -F "file=@yourvideo.mp4" http://<your-ip>:8000/upload/video
```

## Notes
- Make sure port 8000 is open if you want others to access your API.