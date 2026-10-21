import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

const saved = JSON.parse(localStorage.getItem('auth') || 'null');

// mode is "login" or "signup"
export const authenticate = createAsyncThunk(
  'auth/authenticate',
  async ({ mode, ...form }, { rejectWithValue }) => {
    try {
      return await api(`/auth/${mode}`, { method: 'POST', body: form });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: saved?.token || null,
    user: saved?.user || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;