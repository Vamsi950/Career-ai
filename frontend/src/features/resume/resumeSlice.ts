import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import resumeService, { Resume, ResumeAnalysis } from './resumeService';

export interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  improvedContent: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  uploadProgress: number;
}

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
  improvedContent: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  uploadProgress: 0,
};

// Improve resume
export const improveResume = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('resume/improve', async (id, thunkAPI) => {
  try {
    return await resumeService.improveResume(id);
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Upload and analyze resume
export const uploadResume = createAsyncThunk<
  Resume,
  FormData,
  { rejectValue: string }
>('resume/upload', async (formData, thunkAPI) => {
  try {
    return await resumeService.uploadResume(formData);
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

// Get all resumes
export const getResumes = createAsyncThunk<Resume[], void, { rejectValue: string }>(
  'resume/getAll',
  async (_, thunkAPI) => {
    try {
      return await resumeService.getResumes();
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single resume
export const getResume = createAsyncThunk<
  Resume,
  string,
  { rejectValue: string }
>('resume/getSingle', async (id, thunkAPI) => {
  try {
    return await resumeService.getResume(id);
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete resume
export const deleteResume = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('resume/delete', async (id, thunkAPI) => {
  try {
    await resumeService.deleteResume(id);
    return id;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.uploadProgress = 0;
      state.improvedContent = null;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Improve resume
      .addCase(improveResume.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(improveResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.improvedContent = action.payload;
      })
      .addCase(improveResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
      })
      // Upload resume
      .addCase(uploadResume.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
        state.uploadProgress = 0;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resumes.unshift(action.payload);
        state.uploadProgress = 100;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        state.uploadProgress = 0;
      })
      // Get resumes
      .addCase(getResumes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload;
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        state.resumes = [];
      })
      // Get single resume
      .addCase(getResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResume = action.payload;
      })
      .addCase(getResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        state.currentResume = null;
      })
      // Delete resume
      .addCase(deleteResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = state.resumes.filter(
          (resume) => resume._id !== action.payload
        );
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
      });
  },
});

export const { reset, setUploadProgress } = resumeSlice.actions;
export default resumeSlice.reducer;
