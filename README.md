# CareerAI — AI-Powered Resume Analysis Platform

CareerAI is a sophisticated, full-stack AI-powered resume analysis platform designed to bridge the gap between job seekers and Applicant Tracking Systems (ATS). By leveraging advanced Large Language Models (LLMs), CareerAI provides users with an "insider's view" of how their resumes are perceived by modern recruitment technology.

The platform doesn't just scan for keywords; it understands context, identifies hidden strengths, points out critical gaps, and provides an actionable roadmap for resume optimization.

---

## 🌟 Key Features

### 🧠 Intelligent AI Analysis
- **Contextual Understanding**: Uses Groq AI (Llama 3) with OpenAI (GPT-4) fallback to provide deep, meaningful analysis beyond simple pattern matching.
- **ATS Compatibility Scoring**: Generates a dynamic 0–100 score reflecting how well the resume matches a specific job description.
- **Detailed Feedback**: Provides specialized lists for Strengths, Areas for Improvement, and Missing Keywords.

### 📊 Professional Dashboard
- **Personalized Insights**: Track your average ATS score and upload activity.
- **Resume Management**: A clean, high-contrast UI to manage all your uploaded resumes and historical reports.
- **Visual Progress**: Real-time progress tracking during the AI intense analysis phase.

### 📄 Document & View Features
- **AI-Powered Resume Transformation**: Rewrites your resume from scratch using elite career coach prompts to maximize impact and metric-driven achievements.
- **Professional LaTeX-Style Export**: Download your improved resume as a high-end, professionally formatted PDF inspired by elite LaTeX templates.
- **Multi-Format Support**: Full support for PDF and DOCX uploads (up to 5MB).
- **View Original Resume**: Ability to view and open the original uploaded file directly from the analysis report.
- **Step-by-Step Improvement Plan**: Actionable, numbered suggestions to make your resume "market-ready."

### 🎨 Modern "Premium Pro" UI
- **Professional Aesthetics**: Features a professional "Medium Dark" slate sidebar, high-contrast typography, and soft pastel themed report sections.
- **Responsive Design**: Fully optimized for desktops and mobile devices using Material-UI v5.
- **Glassmorphic Elements**: Subtle, refined mesh gradients and translucent app bars for a premium SaaS feel.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (TypeScript)
- **Redux Toolkit** (State Management)
- **Material-UI v5** (Component Library)
- **Emotion** (Styling)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **JWT** (Secure Authentication)
- **Multer** (File Handling)
- **AI Integration**: Groq Cloud SDK & OpenAI SDK

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- API Keys: Groq Cloud API Key and/or OpenAI API Key

### 1. Repository Setup
```bash
git clone https://github.com/your-username/Career-ai.git
cd Career-ai
```

### 2. Backend Configuration
Navigate to the backend folder:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 3. Frontend Configuration
Navigate to the frontend folder:
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### 4. Running the Project
**Start Backend:**
```bash
cd backend
npm run dev
```
**Start Frontend:**
```bash
cd frontend
npm start
```

---

## 📂 Project Structure

```text
Career-ai/
├── backend/            # Express server & AI integration
│   ├── config/         # Database & environment config
│   ├── controllers/    # Route controllers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── services/       # AI logic & file processing
│   └── uploads/        # Statically served resume files
├── frontend/           # React TypeScript application
│   ├── src/
│   │   ├── components/ # Shared UI components
│   │   ├── features/   # Feature-based logic (Auth, Resume)
│   │   └── utils/      # Hooks & helper functions
└── README.md           # Project documentation
```

---

## 🔒 Security & Privacy
- **Secure Auth**: Uses industry-standard JWT for user session management.
- **File Privacy**: Resumes are linked to specific users and cannot be accessed by others.
- **AI Safety**: Only the extracted text is sent for AI analysis; original files remain private.

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
