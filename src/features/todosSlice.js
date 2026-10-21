import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { logout } from './authSlice';

const call = (path, options, getState, rejectWithValue) =>
  api(path, { ...options, token: getState().auth.token }).catch((err) =>
    rejectWithValue(err.message)
  );

export const fetchTodos = createAsyncThunk('todos/fetch', (_, { getState, rejectWithValue }) =>
  call('/todos', {}, getState, rejectWithValue)
);

export const addTodo = createAsyncThunk('todos/add', (title, { getState, rejectWithValue }) =>
  call('/todos', { method: 'POST', body: { title } }, getState, rejectWithValue)
);

export const updateTodo = createAsyncThunk(
  'todos/update',
  ({ id, changes }, { getState, rejectWithValue }) =>
    call(`/todos/${id}`, { method: 'PUT', body: changes }, getState, rejectWithValue)
);

export const deleteTodo = createAsyncThunk('todos/delete', (id, { getState, rejectWithValue }) =>
  call(`/todos/${id}`, { method: 'DELETE' }, getState, rejectWithValue)
);

const initialState = { items: [], status: 'idle', error: null };

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const i = state.items.findIndex((t) => t._id === action.payload._id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload.id);
      })
      .addMatcher(
        (action) => action.type.startsWith('todos/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'idle';
          state.error = action.payload || 'Something went wrong';
        }
      );
  },
});

export default todosSlice.reducer;