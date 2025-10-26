# 🤖 AI Interview Assistant 

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-16%2B-brightgreen.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)

**A comprehensive AI-powered interview preparation system with real-time performance analytics, facial recognition proctoring, and advanced learning insights.**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **AI Interview Assistant** is a full-stack web application designed to help users prepare for technical interviews through AI-powered practice sessions. The system provides:

- **Smart Question Management**: 300+ questions across 6 technical domains
- **Real-time AI Feedback**: Google Gemini AI integration for intelligent analysis
- **Performance Analytics**: Comprehensive dashboard with visual insights
- **Facial Recognition Proctoring**: Face detection for secure proctored exams
- **User Management**: Secure authentication with JWT and bcrypt
- **Progress Tracking**: Historical performance data with detailed reports

### Key Highlights

✨ **Modern Tech Stack**: React 18 + TypeScript + Node.js + Python  
🔒 **Secure**: JWT authentication, bcrypt password hashing, protected routes  
📊 **Data-Driven**: SQLite database with comprehensive analytics  
🤖 **AI-Powered**: Google Gemini AI for intelligent feedback  
👁️ **Proctoring**: Facial recognition for secure interviews  
🎨 **Beautiful UI**: Modern glassmorphism design with smooth animations  

---

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Registration & Login**: JWT-based authentication with bcrypt
- **User Profiles**: Complete profile management with history
- **Session Management**: Persistent login with secure token storage
- **Password Security**: Bcrypt hashing with salt rounds

### 📊 Advanced Analytics Dashboard
- **Score Progression**: Line charts tracking improvement over time
- **Topic Performance**: Bar charts comparing subject mastery
- **Skill Assessment**: Radar charts for multi-dimensional analysis
- **Performance Distribution**: Doughnut and polar area charts
- **Real-time Metrics**: Average scores, best performance, improvement trends

### 🎯 Interview System
- **Multiple Topics**: JavaScript, React, Node.js, Data Structures, System Design, ML
- **Smart Question Pool**: 50+ questions per topic with intelligent shuffling
- **No-Repeat Logic**: Questions don't repeat until pool exhausted
- **Proctored Mode**: Facial recognition for secure testing
- **Normal Mode**: Practice interviews without proctoring
- **AI Analysis**: Real-time feedback using Google Gemini AI

### 📈 Detailed Performance Reports
- **Individual Attempt Analysis**: Comprehensive breakdown of each session
- **Skill Assessment**: Multi-dimensional performance evaluation
- **Personalized Recommendations**: AI-generated improvement suggestions
- **Export & Print**: CSV download and print-friendly reports
- **Historical Tracking**: Complete interview history with filtering

### 👁️ Facial Recognition (Proctoring)
- **Face Detection**: OpenCV-based real-time detection
- **Verification**: Face matching for identity verification
- **Embedding Generation**: DeepFace integration for facial embeddings
- **Live Monitoring**: Continuous face presence during proctored exams

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Glassmorphism**: Modern frosted glass effect UI
- **Smooth Animations**: Fluid transitions and hover effects
- **Dark Theme**: Eye-friendly gradient backgrounds
- **Interactive Charts**: Dynamic data visualization
- **Loading States**: Professional loading indicators

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.5.3 | Type-safe development |
| **Vite** | 5.4.2 | Build tool & dev server |
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **Chart.js** | 4.5.0 | Data visualization |
| **Lucide React** | 0.263.1 | Modern icon library |
| **face-api.js** | 0.22.2 | Client-side face detection |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 22.12.0 | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **SQLite3** | 5.1.6 | Database |
| **JWT** | 9.0.2 | Authentication |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Multer** | 1.4.5 | File upload handling |
| **dotenv** | 16.3.1 | Environment variables |

### Face Recognition Service
| Technology | Version | Purpose |
|-----------|---------|---------|
| **FastAPI** | 0.115.0 | Python web framework |
| **Uvicorn** | 0.30.6 | ASGI server |
| **OpenCV** | 4.10.0.84 | Computer vision |
| **DeepFace** | 0.0.93 | Face recognition |
| **NumPy** | 1.26.4 | Numerical computing |
| **Pillow** | 10.4.0 | Image processing |

### AI & APIs
- **Google Gemini AI**: Intelligent question analysis and feedback
- **Web Speech API**: Speech recognition for voice answers
- **Face Detection API**: Real-time facial recognition

---

## 🏗️ System Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   React     │  │ TypeScript  │  │   Vite      │         │
│  │  Frontend   │  │             │  │   Dev       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
┌──────────────────────┴──────────────────────────────────────┐
│                     Backend API Layer                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Node.js + Express.js Server              │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │   JWT    │  │ Bcrypt   │  │   CORS   │         │    │
│  │  │   Auth   │  │  Hash    │  │          │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └───────────────────┬────────────────────────────────┘    │
└──────────────────────┼──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
┌────────▼────────┐         ┌────────▼─────────┐
│   SQLite DB     │         │  Face Service    │
│                 │         │                  │
│ • Users         │         │ • FastAPI        │
│ • Questions     │         │ • OpenCV         │
│ • Attempts      │         │ • DeepFace       │
│ • Analytics     │         │ • Detection      │
└─────────────────┘         └──────────────────┘
```

### Component Architecture

**Frontend Components:**
- `App.tsx` - Main router and state management
- `AuthScreen` - Login/Registration
- `DashboardScreen` - Analytics dashboard
- `TopicSelection` - Interview topic selection
- `InterviewScreen` - Main interview interface
- `ResultsScreen` - Results display
- `ProfileScreen` - User profile and history
- `PerformanceReport` - Detailed reports

**Backend Routes:**
- `/api/auth/*` - Authentication endpoints
- `/api/profile` - User profile management
- `/api/topics` - Available topics
- `/api/questions/:topic` - Question retrieval
- `/api/attempts` - Interview history
- `/api/analytics` - Performance metrics
- `/api/proctor/*` - Face recognition endpoints

**Services:**
- **apiService.ts** - API communication layer
- **geminiService.ts** - Google Gemini AI integration
- **speechService.ts** - Speech recognition

---

## 📥 Installation

### Prerequisites

- **Node.js**: 16.0.0 or higher
- **Python**: 3.8 or higher
- **npm**: 8.0.0 or higher
- **Git**: For version control

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

#### 2. Install Frontend Dependencies

```bash
npm install
```

#### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

#### 4. Setup Face Recognition Service

```bash
cd face_service

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (CMD):
.venv\Scripts\activate.bat
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
cd ..
```

#### 5. Configure Environment Variables

Create `.env` file in `server/` directory:

```bash
cd server
copy env.example .env
```

Edit `.env` file:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FACE_SERVICE_URL=http://localhost:8001
```

#### 6. Initialize Database

```bash
cd server
npm run init-db
```

This creates:
- Users table
- Questions table (300+ questions)
- Interview attempts table
- Question usage tracking

---

## ⚙️ Configuration

### Frontend Configuration

Create `.env` in project root (optional):

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Google Gemini AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key and add to frontend `.env`

### Port Configuration

Default ports (configurable):
- Frontend: `5173` (Vite)
- Backend: `5000` (Express)
- Face Service: `8001` (FastAPI)
- Database: SQLite file

---

## 🚀 Usage Guide

### Starting the Application

#### Option 1: Quick Start (Windows)

```bash
start.bat
```

#### Option 2: Manual Start

Open **3 separate terminal windows**:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - Face Service:**
```bash
cd face_service
.venv\Scripts\Activate
uvicorn app:app --host 0.0.0.0 --port 8001
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Face Service**: http://localhost:8001

### User Workflow

1. **Register/Login**: Create account or sign in
2. **Select Topic**: Choose interview subject
3. **Choose Mode**: Normal or Proctored
4. **Take Interview**: Answer questions with AI feedback
5. **View Results**: See performance analysis
6. **Check Dashboard**: Review analytics and trends
7. **View History**: Access past attempts

---

## 📡 API Reference

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

### User Management

#### Get Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

#### Get Interview Attempts
```http
GET /api/attempts
Authorization: Bearer <token>
```

#### Submit Interview Attempt
```http
POST /api/attempts
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "JavaScript",
  "score": 8.5,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "durationMinutes": 15,
  "confidenceScore": 7.2,
  "facialExpressionScore": 8.0
}
```

### Questions & Topics

#### Get Available Topics
```http
GET /api/topics
Authorization: Bearer <token>
```

#### Get Questions for Topic
```http
GET /api/questions/:topic
Authorization: Bearer <token>
```

Example: `GET /api/questions/JavaScript`

### Analytics

#### Get Performance Analytics
```http
GET /api/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalAttempts": 45,
  "averageScore": 7.8,
  "bestScore": 9.5,
  "topics": [...],
  "scoreProgression": [...],
  "performanceDistribution": [...]
}
```

### Proctoring (Face Recognition)

#### Face Detection
```http
POST /detect
Content-Type: multipart/form-data

image: [binary file]
```

#### Face Verification
```http
POST /verify
Content-Type: multipart/form-data

image1: [binary file]
image2: [binary file]
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Questions Table
```sql
CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT NOT NULL,
  text TEXT NOT NULL,
  difficulty TEXT DEFAULT 'beginner',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Interview Attempts Table
```sql
CREATE TABLE interview_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  topic TEXT NOT NULL,
  score REAL NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  duration_minutes INTEGER,
  confidence_score REAL,
  facial_expression_score REAL,
  attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Question Usage Tracking
```sql
CREATE TABLE question_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (question_id) REFERENCES questions (id)
);
```

---

## 📁 Project Structure

```
project/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── AuthScreen.tsx       # Authentication UI
│   │   ├── DashboardScreen.tsx  # Analytics dashboard
│   │   ├── InterviewScreen.tsx  # Main interview interface
│   │   ├── ProfileScreen.tsx    # User profile & history
│   │   └── ...
│   ├── services/                 # Service layer
│   │   ├── apiService.ts        # API client
│   │   ├── geminiService.ts     # AI integration
│   │   └── speechService.ts     # Speech recognition
│   ├── types/                    # TypeScript definitions
│   └── utils/                    # Utility functions
├── server/                       # Backend server
│   ├── server.js                # Express server
│   ├── init-database.js         # Database initialization
│   ├── interview_assistant.db   # SQLite database
│   ├── .env                     # Environment variables
│   └── package.json
├── face_service/                 # Python face recognition
│   ├── app.py                   # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   └── .venv/                   # Virtual environment
├── public/                       # Static assets
├── dist/                         # Production build
├── start.bat                     # Windows startup script
├── start.sh                      # Unix startup script
├── package.json                  # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── README.md                     # This file
```

---

## 💻 Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
npm run init-db  # Initialize/reset database
```

**Face Service:**
```bash
uvicorn app:app --host 0.0.0.0 --port 8001  # Start service
```

### Development Workflow

1. Make changes in source files
2. Frontend auto-reloads (Vite HMR)
3. Backend auto-restarts (nodemon)
4. Test in browser
5. Check console for errors

### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to remote: `git push origin feature/new-feature`
4. Create pull request

---

## 🚢 Deployment

### Production Build

**Frontend:**
```bash
npm run build
# Output in dist/ directory
```

**Backend:**
```bash
cd server
npm start
```

### Environment Setup

**Production .env:**
```env
PORT=5000
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
FACE_SERVICE_URL=http://localhost:8001
```

### Deployment Considerations

- Use **PostgreSQL** or **MySQL** for production database
- Set up **reverse proxy** (Nginx/Apache)
- Enable **HTTPS** with SSL certificates
- Configure **CORS** properly
- Set up **environment-specific configs**
- Implement **logging** and **monitoring**
- Use **process manager** (PM2)

---

## 🔒 Security

### Implemented Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - Bcrypt with salt rounds
- ✅ **SQL Injection Protection** - Parameterized queries
- ✅ **CORS Configuration** - Controlled cross-origin access
- ✅ **Input Validation** - Server-side validation
- ✅ **Secure Token Storage** - HTTP-only cookies (optional)
- ✅ **Password Requirements** - Complexity enforcement
- ✅ **Rate Limiting** - Prevent abuse (recommended)

### Security Best Practices

1. **Change Default Secrets**: Update JWT_SECRET
2. **Use HTTPS**: Enable SSL/TLS in production
3. **Environment Variables**: Never commit secrets
4. **Regular Updates**: Keep dependencies updated
5. **Input Sanitization**: Validate all user inputs
6. **Error Handling**: Don't expose sensitive info

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

#### Face Service Not Starting
```bash
# Activate virtual environment
cd face_service
.venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Check installation
python -c "import cv2; print(cv2.__version__)"
```

#### Database Issues
```bash
# Delete and reinitialize
cd server
del interview_assistant.db
npm run init-db
```

#### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- Check console logs for errors
- Review browser dev tools Network tab
- Verify all services are running
- Check environment variables
- Review database connection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Contact & Support

- **Documentation**: See SETUP_INSTRUCTIONS.md
- **Issues**: GitHub Issues
- **Email**: [Your Contact]

---

## 🙏 Acknowledgments

- **React Team** - Amazing UI framework
- **Vite** - Lightning-fast build tool
- **Express.js** - Robust web framework
- **OpenCV** - Computer vision library
- **Google Gemini AI** - Intelligent analysis
- **Tailwind CSS** - Beautiful styling

---

<div align="center">

**Built with ❤️ using modern web technologies**

⭐ **Star this repo if you find it helpful!**

[Back to Top](#-ai-interview-assistant---complete-solution)

</div>

