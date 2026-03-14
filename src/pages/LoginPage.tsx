import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const { currentUser, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Si ya está autenticado, redirige
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email y contraseña son requeridos');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Email o contraseña inválidos');
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <Card className="bg-brand-600 shadow rounded-card px-6 py-8">
        <div className="flex items-center text-text text-2xl gap-2 mb-6">
          <FiLogIn size={28} />
          <h1 className="font-bold">Inicia Sesión</h1>
        </div>

        <p className="text-text text-sm mb-6">
          Bienvenido a SalaFinder - Sistema de Reserva de Espacios
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Email */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-surface uppercase">Email</span>
            <input
              className="rounded-input border border-border bg-surface px-4 py-3 text-sm text-text placeholder-muted outline-none focus:ring-2 focus:ring-brand-300"
              type="email"
              placeholder="admin@salafinder.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Contraseña */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-surface uppercase">Contraseña</span>
            <input
              className="rounded-input border border-border bg-surface px-4 py-3 text-sm text-text placeholder-muted outline-none focus:ring-2 focus:ring-brand-300"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {/* Error Message */}
          {error && (
            <div className="bg-danger-100 border border-danger-300 rounded-card p-3">
              <p className="text-sm text-danger-800 m-0">❌ {error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" variant="primary" className="w-full justify-center mt-2">
            <FiLogIn size={18} /> Inicia Sesion
          </Button>

          <p className="text-center text-sm text-muted">
            No tienes cuenta?{' '}
            <a href="/register" className="text-brand-600 hover:underline font-semibold">
              Registrate
            </a>
          </p>

          {/* Info */}
          <div className="bg-brand-700 rounded-card p-4 mt-4">
            <p className="text-surface text-sm font-semibold mb-3">📧 Usuarios de prueba:</p>
            <div className="space-y-2">
              <div className="text-xs text-surface">
                <p className="font-mono font-bold">admin@salafinder.com</p>
                <p className="opacity-75">Rol: ADMIN</p>
              </div>
              <div className="text-xs text-surface">
                <p className="font-mono font-bold">juan@uni.com</p>
                <p className="opacity-75">Rol: STUDENT</p>
              </div>
              <div className="text-xs text-surface">
                <p className="font-mono font-bold">staff1@salafinder.com</p>
                <p className="opacity-75">Rol: STAFF</p>
              </div>
            </div>
            <p className="text-xs text-surface opacity-75 mt-3 m-0">
              💡 Puedes usar cualquier contraseña
            </p>
          </div>
        </form>
      </Card>
    </main>
  );
}