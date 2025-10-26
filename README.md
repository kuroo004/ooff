# Face Recognition Microservice (FastAPI + DeepFace)

## Endpoints
- `GET /health`: Health check
- `POST /embed`: form-data with `image` file, optional `model` (default `Facenet512`). Returns embedding vector
- `POST /verify`: form-data with `image1`, `image2`, optional `model` (default `Facenet512`), optional `metric` (default `cosine`). Returns `match`, `distance`, `threshold`
- `POST /identify`: placeholder for gallery-based identification

## Local setup
```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001
```

## Notes
- Uses DeepFace for embeddings and verification with `enforce_detection=False` to reduce failures during live webcam frames
- For production, prefer running with GPU-enabled backends and pinned models

