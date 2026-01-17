# AI Resume Analyzer

A full-stack web application that helps students analyze their resumes and prepare for interviews using AI. Built with React, Node.js, MongoDB, and Python.

## Features

- **Resume Analysis** - Upload your resume and get instant feedback on skills, experience, and improvements
- **Role Classification** - Automatically detects if your resume is suited for Frontend, Backend, Full Stack, etc.
- **Job Matching** - Compare your resume against job descriptions to see what skills you're missing
- **Mock Interviews** - Practice interviews with AI-generated questions based on your target role
- **Progress Tracking** - View your interview history and resume scores

## Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)

**ML Service:**
- Python + Flask
- Resume parsing (PDF/DOCX)
- Keyword-based classification

## Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB

### Installation

1. Clone the repo
```bash
git clone <your-repo-url>
cd MLPROJECT
```

2. Run setup script
```bash
chmod +x setup.sh
./setup.sh
```

3. Configure environment variables

Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000
```

4. Start the application
```bash
chmod +x start.sh
./start.sh
```

The app will run on:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- ML Service: http://localhost:8000

## Usage

1. Register/Login with email and password
2. Upload your resume (PDF or DOCX)
3. View analysis results and classified role
4. Click "Match with Job Description" to compare with a job posting
5. Start a mock interview by selecting your target role
6. Answer questions and get feedback

## Project Structure

```
MLPROJECT/
├── frontend/          # React app
├── backend/           # Node.js API
├── ml-service/        # Python ML service
├── setup.sh          # Setup script
└── start.sh          # Start script
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/user` - Get current user

### Resume
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/analysis/:id` - Get analysis
- `POST /api/resume/match-job` - Match with job description

### Interview
- `POST /api/interview/start` - Start interview
- `POST /api/interview/answer` - Submit answer
- `GET /api/interview/result/:id` - Get results

## Development

Built as a final year project to learn full-stack development and AI integration.

**What I learned:**
- Building REST APIs with Express
- JWT authentication
- File upload handling
- React state management
- Integrating multiple services
- Python Flask for ML

## Known Issues

- Resume parsing accuracy depends on format
- Role classification uses keyword matching (not deep learning)
- Interview questions are template-based

## Future Improvements

- Add more sophisticated NLP for resume parsing
- Implement real-time interview feedback
- Add support for more file formats
- Deploy to cloud (AWS/Heroku)

## License

MIT

---

**Note:** This is a learning project. Feel free to use it for your portfolio or modify it for your needs.
