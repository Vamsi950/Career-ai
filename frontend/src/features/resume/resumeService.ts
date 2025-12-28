import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/resumes/';

export interface Resume {
  _id: string;
  originalName: string;
  fileName: string;
  fileType: string;
  extractedText: string;
  analysis: ResumeAnalysis;
  user: {
    _id: string;
    email: string;
  };
  createdAt: string;
}

export interface ResumeAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  improvement_suggestions: string[];
  missing_keywords: string[];
  ats_score: number;
  overall_assessment: string;
}

// Get auth token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Upload and analyze resume
const uploadResume = async (formData: FormData): Promise<Resume> => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, formData, config);
  return response.data.data;
};

// Get all resumes
const getResumes = async (): Promise<Resume[]> => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data.data;
};

// Get single resume
const getResume = async (id: string): Promise<Resume> => {
  const response = await axios.get(API_URL + id, getAuthConfig());
  return response.data.data;
};

// Delete resume
const deleteResume = async (id: string): Promise<void> => {
  await axios.delete(API_URL + id, getAuthConfig());
};

// Improve resume with AI
const improveResume = async (id: string): Promise<string> => {
  const response = await axios.post(API_URL + id + '/improve', {}, getAuthConfig());
  return response.data.data;
};

const resumeService = {
  uploadResume,
  getResumes,
  getResume,
  deleteResume,
  improveResume,
};

export default resumeService;
