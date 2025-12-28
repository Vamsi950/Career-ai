import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from './authService';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Register user
export const register = createAsyncThunk<
  { user: User; token: string },
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async (userData, thunkAPI) => {
  try {
    return await authService.register(userData);
  } catch (error: any) {
    const apiError = error?.response?.data?.error;
    const apiMessage = error?.response?.data?.message;
    const message =
      (Array.isArray(apiError) ? apiError.join(', ') : apiError) ||
      apiMessage ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Login user
export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error: any) {
    const apiError = error?.response?.data?.error;
    const apiMessage = error?.response?.data?.message;
    const message =
      (Array.isArray(apiError) ? apiError.join(', ') : apiError) ||
      apiMessage ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get current user
export const getMe = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      return await authService.getMe();
    } catch (error: any) {
      const apiError = error?.response?.data?.error;
      const apiMessage = error?.response?.data?.message;
      const message =
        (Array.isArray(apiError) ? apiError.join(', ') : apiError) ||
        apiMessage ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        state.user = null;
        state.token = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        state.user = null;
        state.token = null;
      })
      // Get current user
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
