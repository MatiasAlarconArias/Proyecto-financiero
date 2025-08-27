import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FormLogin.css';

export default function FormRegister() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Cuenta creada ✅');

        // Guardar usuario para mantener sesión (opcional)
        localStorage.setItem('user', JSON.stringify(data));

        navigate('/'); // redirige al login
      } else {
        alert(data.message || 'Error al registrarse ❌');
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
          <h2>Regístrate</h2>

          <div className="container-input">
            <span>Nombre</span>
            <input
              type="text"
              placeholder="Tu nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="container-input">
            <span>Apellido</span>
            <input
              type="text"
              placeholder="Tu apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="container-input">
            <span>Correo</span>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
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

          <div className="container-input">
            <span>Teléfono (opcional)</span>
            <input
              type="text"
              placeholder="+56 9 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit">Crear Cuenta</button>
          <p>
            ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
