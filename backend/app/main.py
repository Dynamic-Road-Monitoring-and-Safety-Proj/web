from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/csv")
async def upload_csv(file: UploadFile = File(...)):
    csv_dir = os.path.join(UPLOAD_DIR, "csv")
    os.makedirs(csv_dir, exist_ok=True)
    if not file.filename.endswith('.csv'):
        return JSONResponse(status_code=400, content={"error": "File must be a CSV"})
    file_path = os.path.join(csv_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename, "saved_to": file_path}

@app.post("/upload/video")
async def upload_video(file: UploadFile = File(...)):
    video_dir = os.path.join(UPLOAD_DIR, "video")
    os.makedirs(video_dir, exist_ok=True)
    if not (file.filename.endswith('.mp4') or file.filename.endswith('.avi') or file.filename.endswith('.mov')):
        return JSONResponse(status_code=400, content={"error": "File must be a video (.mp4, .avi, .mov)"})
    file_path = os.path.join(video_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename, "saved_to": file_path}
