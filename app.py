from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from io import BytesIO
from PIL import Image
import cv2
import numpy as np

# Choose backend: OpenCV for face detection
try:
    import cv2
    _BACKEND = "opencv"
except Exception as e:
    print(f"OpenCV import error: {e}")
    _BACKEND = "none"

app = FastAPI(title="Face Recognition Service", version="1.0.0")


class EmbedResponse(BaseModel):
    embedding: List[float]
    model: str


class VerifyResponse(BaseModel):
    match: bool
    distance: float
    threshold: float
    model: str


def _pil_from_upload(upload: UploadFile) -> Image.Image:
    content = upload.file.read()
    return Image.open(BytesIO(content)).convert("RGB")


@app.get("/health")
def health():
    return {"status": "ok", "backend": _BACKEND, "opencv_available": _BACKEND == "opencv"}


@app.post("/embed", response_model=EmbedResponse)
async def embed(image: UploadFile = File(...), model: str = Form("Facenet512")):
    if _BACKEND != "deepface":
        return JSONResponse(status_code=500, content={"error": "DeepFace not available"})

    pil_img = _pil_from_upload(image)
    # DeepFace.represent returns list of dicts when enforce_detection=True
    representations = DeepFace.represent(pil_img, model_name=model, enforce_detection=False)
    if not representations:
        return JSONResponse(status_code=400, content={"error": "No face found"})
    rep = representations[0]
    return {"embedding": rep["embedding"], "model": model}


@app.post("/verify", response_model=VerifyResponse)
async def verify(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...),
    model: str = Form("Facenet512"),
    metric: str = Form("cosine")
):
    if _BACKEND != "deepface":
        return JSONResponse(status_code=500, content={"error": "DeepFace not available"})

    pil1 = _pil_from_upload(image1)
    pil2 = _pil_from_upload(image2)
    result = DeepFace.verify(pil1, pil2, model_name=model, distance_metric=metric, enforce_detection=False)
    return {
        "match": bool(result.get("verified")),
        "distance": float(result.get("distance", 0.0)),
        "threshold": float(result.get("threshold", 0.0)),
        "model": model,
    }


class IdentifyResponse(BaseModel):
    identity: Optional[str]
    distance: Optional[float]
    model: str


@app.post("/identify", response_model=IdentifyResponse)
async def identify(
    image: UploadFile = File(...),
    model: str = Form("Facenet512"),
):
    # Identification requires a dataset or embeddings; this endpoint is a stub.
    # Integrate with your gallery store later. For now it returns None.
    return {"identity": None, "distance": None, "model": model}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=False)

# -----------------------------
# Face Detection (OpenCV only)
# -----------------------------

class DetectResponse(BaseModel):
    faceDetected: bool
    numFaces: int


@app.post("/detect", response_model=DetectResponse)
async def detect(image: UploadFile = File(...)):
    try:
        print(f"Received image: {image.filename}, size: {image.size}")
        
        # Read upload into OpenCV image
        data = await image.read()
        print(f"Image data length: {len(data)}")
        
        np_img = np.frombuffer(data, np.uint8)
        bgr = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        if bgr is None:
            print("Failed to decode image")
            return JSONResponse(status_code=400, content={"error": "Invalid image"})

        print(f"Image dimensions: {bgr.shape}")
        
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        
        # Use built-in OpenCV Haar cascade path
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        print(f"Loading cascade from: {cascade_path}")
        
        face_cascade = cv2.CascadeClassifier(cascade_path)
        if face_cascade.empty():
            print("Failed to load cascade classifier")
            return JSONResponse(status_code=500, content={"error": "Cascade classifier not loaded"})
        
        # First pass: more sensitive
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=3, minSize=(40, 40))
        print(f"First pass detected {len(faces) if faces is not None else 0} faces")
        
        # Fallback tighter pass if no faces found
        if faces is None or len(faces) == 0:
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
            print(f"Second pass detected {len(faces) if faces is not None else 0} faces")
        
        num_faces = 0 if faces is None else len(faces)
        result = {"faceDetected": num_faces > 0, "numFaces": int(num_faces)}
        print(f"Final result: {result}")
        return result
        
    except Exception as e:
        print(f"Error in detect: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})


