import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/auth/';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

// Register user
const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
const login = async (userData: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Get current user
const getMe = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'me', config);
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  getMe,
  logout,
};

export default authService;
