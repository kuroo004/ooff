# Complete Setup & Run Instructions

## Prerequisites
- Node.js 16+ installed
- Python 3.8+ installed
- npm (comes with Node.js)
- Git (optional, for cloning repository)

---

## First Time Setup (One-Time Only)

### Step 1: Install Frontend Dependencies
```bash
cd C:\stuff\project
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd C:\stuff\project\server
npm install
cd ..
```

### Step 3: Configure Backend Environment
```bash
cd C:\stuff\project\server
copy env.example .env
```
Edit `.env` file and update if needed:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FACE_SERVICE_URL=http://localhost:8001
```

### Step 4: Initialize Database
```bash
cd C:\stuff\project\server
npm run init-db
```

### Step 5: Setup Face Recognition Service
```bash
cd C:\stuff\project\face_service
python -m venv .venv
.venv\Scripts\Activate
pip install -r requirements.txt
```

---

## Starting All Services (Every Time You Run)

### Method 1: Automatic Start (Recommended for Windows)
```bash
cd C:\stuff\project
start.bat
```

### Method 2: Manual Start (For Better Control)

Open **4 separate terminal windows**:

#### Terminal 1: Backend Server
```bash
cd C:\stuff\project\server
npm run dev
```
**Status:** Backend running on http://localhost:5000

#### Terminal 2: Frontend Server
```bash
cd C:\stuff\project
npm run dev
```
**Status:** Frontend running on http://localhost:5173 (or 5174, 5175 if ports are busy)

#### Terminal 3: Face Recognition Service
```bash
cd C:\stuff\project\face_service
.venv\Scripts\Activate
uvicorn app:app --host 0.0.0.0 --port 8001
```
**Status:** Face service running on http://localhost:8001

#### Terminal 4: (Optional - Monitoring)
Keep this terminal for running other commands or monitoring.

---

## Quick Start Checklist

- [ ] Open Terminal 1: Start backend (`cd server && npm run dev`)
- [ ] Wait 3-5 seconds for backend to initialize
- [ ] Open Terminal 2: Start frontend (`npm run dev`)
- [ ] Open Terminal 3: Start face service (`cd face_service && .venv\Scripts\Activate && uvicorn app:app --host 0.0.0.0 --port 8001`)
- [ ] Open browser: Navigate to http://localhost:5173

---

## Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application UI |
| Backend API | http://localhost:5000 | REST API endpoints |
| Face Service | http://localhost:8001 | Face recognition microservice |
| Database | server/interview_assistant.db | SQLite database file |

---

## Troubleshooting

### Port Already in Use
- **Solution:** Vite will automatically use the next available port (5174, 5175, etc.)
- Check the terminal output for the actual port number

### Face Service Not Starting
- Make sure virtual environment is activated: `.venv\Scripts\Activate`
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check if port 8001 is available

### Backend Not Connecting
- Verify backend is running on port 5000
- Check `.env` file exists in `server/` directory
- Ensure database is initialized: `npm run init-db`

### Database Issues
- Delete `server/interview_assistant.db` and run `npm run init-db` again
- This will reset all data!

---

## Stopping Services

### Windows
- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

### Using start.bat
- Close the terminal windows that were opened

---

## File Structure

```
project/
├── server/              # Backend Node.js server
│   ├── server.js       # Main server file
│   ├── .env            # Environment variables (create from env.example)
│   ├── interview_assistant.db  # SQLite database
│   └── package.json    # Backend dependencies
├── src/                # Frontend React code
│   ├── components/     # React components
│   ├── services/       # API services
│   └── types/          # TypeScript types
├── face_service/       # Python face recognition service
│   ├── app.py         # FastAPI application
│   └── .venv/         # Python virtual environment
├── public/             # Static assets
├── start.bat           # Windows startup script
├── package.json        # Frontend dependencies
└── README.md           # Project documentation
```

---

## Important Notes

1. **Database:** Data persists in `server/interview_assistant.db` - don't delete this unless you want to reset everything
2. **Face Service:** Only needed for proctored interview mode
3. **Ports:** If ports 5000, 5173, or 8001 are busy, use `netstat -ano | findstr :PORT` to find what's using them
4. **Virtual Environment:** Always activate the venv before running face service: `.venv\Scripts\Activate`

---

## Quick Reference Commands

```bash
# Frontend
npm run dev                    # Start frontend
npm run build                  # Build for production

# Backend
cd server
npm run dev                    # Start backend (dev mode)
npm start                      # Start backend (production)
npm run init-db                # Initialize/reset database

# Face Service
cd face_service
.venv\Scripts\Activate         # Activate virtual environment
uvicorn app:app --host 0.0.0.0 --port 8001  # Start service

# All at once (Windows)
start.bat                      # Starts backend + frontend
```

---

## Success Indicators

✅ **Backend:** Terminal shows "Server running on port 5000"
✅ **Frontend:** Terminal shows "Local: http://localhost:5173"
✅ **Face Service:** Terminal shows "Uvicorn running on http://0.0.0.0:8001"
✅ **Browser:** App loads at http://localhost:5173 with login screen

---

**Last Updated:** $(date)
