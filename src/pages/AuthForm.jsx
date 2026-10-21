import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { authenticate, clearError } from '../features/authSlice';

export default function AuthForm({ mode }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const isSignup = mode === 'signup';

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    dispatch(authenticate({ mode, ...form }));
  };

  return (
    <main className="card">
      <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
      <form onSubmit={submit}>
        {isSignup && (
          <label>
            Name
            <input name="name" value={form.name} onChange={change} required />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={change} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            minLength={6}
            value={form.password}
            onChange={change}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
        </button>
      </form>
      <p className="switch">
        {isSignup ? 'Already have an account? ' : 'New here? '}
        <Link to={isSignup ? '/login' : '/signup'} onClick={() => dispatch(clearError())}>
          {isSignup ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </main>
  );
}