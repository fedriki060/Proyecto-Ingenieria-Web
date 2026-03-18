import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { UserRole } from '../types';
import { FiUserPlus } from 'react-icons/fi';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  program: string;
}

const PROGRAMS = ['Ingenieria', 'Administracion', 'TI', 'Tecnologia', 'Otro'];

export default function RegisterPage() {
  const { currentUser, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT,
    program: 'Ingenieria',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) navigate('/');
  }, [currentUser, navigate]);

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'El nombre debe tener al menos 2 caracteres';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Ingresa un email valido';
    if (form.password.length < 6)
      errs.password = 'La contrasena debe tener al menos 6 caracteres';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Las contrasenas no coinciden';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const success = login(form.email, form.password);
    if (success) {
      navigate('/');
    } else {
      setSubmitError('Este email no esta registrado. Usa uno de los usuarios de prueba.');
    }
    setIsSubmitting(false);
  };

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <Card className="bg-brand-600 shadow rounded-card px-6 py-8">
        <div className="flex items-center text-text text-2xl gap-2 mb-6">
          <FiUserPlus size={28} />
          <h1 className="font-bold">Crear cuenta</h1>
        </div>

        <p className="text-text text-sm mb-6">
          Registrate en SalaFinder para reservar espacios
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>

          {/* Nombre */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-surface uppercase">Nombre completo</span>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Juan Perez"
              className="rounded-input border border-border bg-surface px-4 py-3 text-sm text-text placeholder-muted outline-none focus:ring-2 focus:ring-brand-300"
            />
            {errors.name && (
              <p className="text-xs text-danger-800" role="alert">{errors.name}</p>
            )}
          </label>

          {/* Email */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-surface uppercase">Correo electronico</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@universidad.edu"
              className="rounded-input border border-border bg-surface px-4 py-3 text-sm text-text placeholder-muted outline-none focus:ring-2 focus:ring-brand-300"
            />
            {errors.email && (
              <p className="text-xs text-danger-800" role="alert">{errors.email}</p>
            )}
          </label>

          {/* Rol y Programa */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-surface uppercase">Rol</span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="rounded-input border border-border bg-surface px-3 py-3 text-sm text-text outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value={UserRole.STUDENT}>Estudiante</option>
                <option value={UserRole.STAFF}>Staff</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-surface uppercase">Programa</span>
              <select
                name="program"
                value={form.program}
                onChange={handleChange}
                className="rounded-input border border-border bg-surface px-3 py-3 text-sm text-text outline-none focus:ring-2 focus:ring-brand-300"
              >
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Contraseña */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-surface uppercase">Contrasena</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimo 6 caracteres"
              className="rounded-input border border-border bg-surface px-4 py-3 text-sm text-text placeholder-muted outline-none focus:ring-2 focus:ring-brand-300"
            />
            {errors.password && (
              <p className="text-xs text-danger-800" role="alert">{errors.password}</p>
            )}
          </label>

          {/* Confirmar contraseña */}
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-surface uppercase">Confirmar contrasena</span>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contrasena"
              className="rounded-input border border-border bg-surface px-4 py-3 text-sm text-text placeholder-muted outline-none focus:ring-2 focus:ring-brand-300"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-danger-800" role="alert">{errors.confirmPassword}</p>
            )}
          </label>

          {/* Error general */}
          {submitError && (
            <div className="bg-danger-100 border border-danger-300 rounded-card p-3">
              <p className="text-sm text-danger-800 m-0">❌ {submitError}</p>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full justify-center mt-2 cursor-pointer" isLoading={isSubmitting}>
            <FiUserPlus size={18} /> Crear cuenta
          </Button>

          {/* Info usuarios de prueba */}
          <div className="bg-brand-700 rounded-card p-4 mt-2">
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
              💡 Puedes usar cualquier contrasena
            </p>
          </div>

          <p className="text-center text-sm text-surface">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">
              Inicia sesion
            </Link>
          </p>

        </form>
      </Card>
    </main>
  );
}