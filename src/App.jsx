import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthForm from './pages/AuthForm';
import Todos from './pages/Todos';

export default function App() {
  const token = useSelector((s) => s.auth.token);

  return (
    <Routes>
      <Route path="/" element={token ? <Todos /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <AuthForm mode="login" />} />
      <Route path="/signup" element={token ? <Navigate to="/" replace /> : <AuthForm mode="signup" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}