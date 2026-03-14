import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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
  const { showToast } = useToast();
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simular registro (fake — en el seed no guardamos el nuevo user en localStorage de forma completa
    // pero hacemos login inmediato con el admin para demostrar el flujo)
    await new Promise((r) => setTimeout(r, 700));

    // Para demo: si el email ya existe en seed, registramos con ese email
    // Si no, notificamos éxito y redirigimos al login
    const success = login(form.email, form.password);
    if (success) {
      showToast(`Bienvenido, ${form.name}!`, 'success');
      navigate('/');
    } else {
      showToast('Registro exitoso. Ahora puedes iniciar sesion.', 'success');
      navigate('/login');
    }
    setIsSubmitting(false);
  };

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <Card className="shadow rounded-card px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <FiUserPlus size={28} className="text-brand-600" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-text">Crear cuenta</h1>
        </div>
        <p className="text-muted text-sm mb-6">
          Registrate para reservar espacios en SalaFinder
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nombre */}
          <div>
            <label htmlFor="reg-name" className="block text-sm font-semibold text-text mb-1">
              Nombre completo
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Juan Perez"
              required
              aria-describedby={errors.name ? 'err-name' : undefined}
              aria-invalid={!!errors.name}
              className={`w-full px-4 py-3 rounded-input border text-sm text-text bg-surface placeholder-muted outline-none focus:ring-2 focus:ring-brand-300 ${errors.name ? 'border-danger-600' : 'border-border'}`}
            />
            {errors.name && <p id="err-name" role="alert" className="text-xs text-danger-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-sm font-semibold text-text mb-1">
              Correo electronico
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@universidad.edu"
              required
              aria-describedby={errors.email ? 'err-email' : undefined}
              aria-invalid={!!errors.email}
              className={`w-full px-4 py-3 rounded-input border text-sm text-text bg-surface placeholder-muted outline-none focus:ring-2 focus:ring-brand-300 ${errors.email ? 'border-danger-600' : 'border-border'}`}
            />
            {errors.email && <p id="err-email" role="alert" className="text-xs text-danger-600 mt-1">{errors.email}</p>}
          </div>

          {/* Rol y Programa */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-role" className="block text-sm font-semibold text-text mb-1">
                Rol
              </label>
              <select
                id="reg-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-3 rounded-input border border-border bg-surface text-text text-sm focus:ring-2 focus:ring-brand-300 outline-none"
              >
                <option value={UserRole.STUDENT}>Estudiante</option>
                <option value={UserRole.STAFF}>Staff</option>
              </select>
            </div>
            <div>
              <label htmlFor="reg-program" className="block text-sm font-semibold text-text mb-1">
                Programa
              </label>
              <select
                id="reg-program"
                name="program"
                value={form.program}
                onChange={handleChange}
                className="w-full px-3 py-3 rounded-input border border-border bg-surface text-text text-sm focus:ring-2 focus:ring-brand-300 outline-none"
              >
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="reg-password" className="block text-sm font-semibold text-text mb-1">
              Contrasena
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimo 6 caracteres"
              required
              aria-describedby={errors.password ? 'err-password' : undefined}
              aria-invalid={!!errors.password}
              className={`w-full px-4 py-3 rounded-input border text-sm text-text bg-surface placeholder-muted outline-none focus:ring-2 focus:ring-brand-300 ${errors.password ? 'border-danger-600' : 'border-border'}`}
            />
            {errors.password && <p id="err-password" role="alert" className="text-xs text-danger-600 mt-1">{errors.password}</p>}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="reg-confirm" className="block text-sm font-semibold text-text mb-1">
              Confirmar contrasena
            </label>
            <input
              id="reg-confirm"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contrasena"
              required
              aria-describedby={errors.confirmPassword ? 'err-confirm' : undefined}
              aria-invalid={!!errors.confirmPassword}
              className={`w-full px-4 py-3 rounded-input border text-sm text-text bg-surface placeholder-muted outline-none focus:ring-2 focus:ring-brand-300 ${errors.confirmPassword ? 'border-danger-600' : 'border-border'}`}
            />
            {errors.confirmPassword && (
              <p id="err-confirm" role="alert" className="text-xs text-danger-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full justify-center" isLoading={isSubmitting}>
            <FiUserPlus aria-hidden="true" /> Crear cuenta
          </Button>

          <p className="text-center text-sm text-muted">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="text-brand-600 hover:underline font-semibold">
              Inicia sesion
            </Link>
          </p>
        </form>
      </Card>
    </main>
  );
}
