import { useState } from 'react';
import { login } from '../services/auth';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError('Inserte usuario y contraseña');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const session = await login(username, password);
      onSuccess(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <form className="panel" onSubmit={submit} style={{ maxWidth: 320, margin: '10vh auto' }}>
        <h2>Acceso</h2>
        <input placeholder="Usuario" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Contraseña" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>Acceder</button>
      </form>
    </main>
  );
}
