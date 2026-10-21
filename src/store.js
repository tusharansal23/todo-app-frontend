import { configureStore } from '@reduxjs/toolkit';
import auth from './features/authSlice';
import todos from './features/todosSlice';

export default configureStore({ reducer: { auth, todos } });