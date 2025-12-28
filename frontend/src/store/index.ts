import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import resumeReducer from '../features/resume/resumeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export { useAppDispatch, useAppSelector } from '../utils/hooks';
