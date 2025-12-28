# CareerAI — Backend Service

A high-performance, secure backend service for parsing and analyzing resumes using advanced Large Language Models (LLMs). This service provides the core AI logic, secure file handling, and RESTful API endpoints for the CareerAI platform.

## 🚀 Key Features

- **Multi-Model AI Analysis**: Integrated with Groq Cloud (Llama 3) for primary analysis and OpenAI (GPT-4) as a robust fallback.
- **Advanced Text Extraction**: High-accuracy text extraction from PDF and DOCX formats.
- **ATS Scoring Engine**: A proprietary logic for evaluating resume-to-JD compatibility.
- **Scaleable File Handling**: Secure upload management with Multer and static serving for resume viewing.
- **JWT-Based Security**: Complete authentication and authorization flow using JSON Web Tokens.
- **RESTful API Architecture**: Clean, structured, and predictable API endpoints.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- OpenAI API key

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd resume-analyzer/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   UPLOAD_FOLDER=uploads/
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Create the uploads directory
   ```bash
   mkdir uploads
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Documentation

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout user

### Resumes

- `POST /api/v1/resumes` - Upload and analyze resume
- `GET /api/v1/resumes` - Get all resumes for current user
- `GET /api/v1/resumes/:id` - Get single resume
- `DELETE /api/v1/resumes/:id` - Delete resume

## Environment Variables

- `PORT` - Port to run the server on (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT
- `JWT_EXPIRE` - JWT expiration time
- `UPLOAD_FOLDER` - Directory to store uploaded files
- `OPENAI_API_KEY` - OpenAI API key

## Testing

Run the test suite:
```bash
npm test
```

## Linting

Run ESLint:
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
