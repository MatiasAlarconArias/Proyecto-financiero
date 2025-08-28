import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FormLogin.css';

export default function FormLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 🔑 permite cookies JWT
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        navigate('/dashboard');
      } else {
        alert(data.message || 'Error al iniciar sesión ❌');
      }
    } catch (err) {
      console.error(err);
      alert('Error en el servidor ❌');
    }
  };

  return (
    <div className="Login-wrapper">
      <div className="Container-form">
        <form onSubmit={handleSubmit}>
          <h1>Aplicacion financiera</h1>
          <hr />
          <h2>Inicia sesión</h2>

          <div className="container-input">
            <span>Correo</span>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="container-input">
            <span>Contraseña</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Iniciar Sesión</button>
          <p>
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
