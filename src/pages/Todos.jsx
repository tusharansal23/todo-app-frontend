import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../features/todosSlice';
import { logout } from '../features/authSlice';

const FILTERS = ['all', 'active', 'done'];

export default function Todos() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { items, status, error } = useSelector((s) => s.todos);

  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // An expired or invalid token sends the user back to the login page
  useEffect(() => {
    if (error === 'Not authorized') dispatch(logout());
  }, [error, dispatch]);

  const visible = items.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.completed : !t.completed
  );
  const remaining = items.filter((t) => !t.completed).length;

  const add = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addTodo(title.trim()));
    setTitle('');
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setDraft(todo.title);
  };

  const saveEdit = (todo) => {
    const next = draft.trim();
    if (next && next !== todo.title) {
      dispatch(updateTodo({ id: todo._id, changes: { title: next } }));
    }
    setEditingId(null);
  };

  return (
    <main className="card wide">
      <header className="top">
        <h1>{user?.name}'s to-dos</h1>
        <button className="ghost" onClick={() => dispatch(logout())}>
          Log out
        </button>
      </header>

      <form className="add" onSubmit={add}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          maxLength={200}
        />
        <button type="submit">Add</button>
      </form>

      <nav className="filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? 'tab active' : 'tab'}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <span className="count">{remaining} left</span>
      </nav>

      {error && error !== 'Not authorized' && <p className="error">{error}</p>}
      {status === 'loading' && <p className="muted">Loading…</p>}
      {status !== 'loading' && visible.length === 0 && (
        <p className="muted">Nothing here yet.</p>
      )}

      <ul className="list">
        {visible.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'done' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                dispatch(updateTodo({ id: todo._id, changes: { completed: !todo.completed } }))
              }
              aria-label={`Mark "${todo.title}" as ${todo.completed ? 'not done' : 'done'}`}
            />
            {editingId === todo._id ? (
              <input
                className="edit"
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => saveEdit(todo)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(todo);
                  if (e.key === 'Escape') setEditingId(null);
                }}
              />
            ) : (
              <span className="title" onDoubleClick={() => startEdit(todo)}>
                {todo.title}
              </span>
            )}
            <button className="ghost" onClick={() => startEdit(todo)}>
              Edit
            </button>
            <button className="ghost danger" onClick={() => dispatch(deleteTodo(todo._id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}