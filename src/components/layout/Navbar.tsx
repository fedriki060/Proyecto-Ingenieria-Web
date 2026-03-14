import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  FiLogOut, FiHome, FiCalendar, FiClipboard,
  FiSun, FiMoon, FiMenu, FiX,
} from 'react-icons/fi';
import { UserRole } from '../../types';
import { initTheme, toggleTheme } from '../../utils/theme';

export default function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    initTheme();
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  if (!currentUser) return null;

  const navLinks = [
    { to: '/', label: 'Inicio', icon: <FiHome aria-hidden="true" /> },
    { to: '/spaces', label: 'Espacios', icon: <FiCalendar aria-hidden="true" /> },
    { to: '/reservations', label: 'Mis reservas', icon: <FiClipboard aria-hidden="true" /> },
    ...(currentUser.role === UserRole.ADMIN
      ? [{ to: '/admin', label: 'Admin', icon: <FiClipboard aria-hidden="true" /> }]
      : []),
  ];

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header>
      <nav
        className="bg-brand-700 text-surface shadow-card sticky top-0 z-40"
        aria-label="Navegacion principal"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 focus-visible:ring-2 focus-visible:ring-surface rounded">
            <span aria-hidden="true">🏛️</span>
            <span>SalaFinder</span>
          </Link>

          <div className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                role="listitem"
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-btn text-sm transition-colors
                  focus-visible:ring-2 focus-visible:ring-surface outline-none
                  ${isActive(link.to) ? 'bg-brand-800 font-semibold' : 'hover:bg-brand-600'}
                `}
                aria-current={isActive(link.to) ? 'page' : undefined}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="cursor-pointer p-2 rounded-btn hover:bg-brand-600 transition focus-visible:ring-2 focus-visible:ring-surface outline-none"
            >
              {isDark ? <FiSun size={18} aria-hidden="true" /> : <FiMoon size={18} aria-hidden="true" />}
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="text-sm text-right">
                <p className="font-semibold leading-tight">{currentUser.name}</p>
                <p className="text-xs opacity-75">{currentUser.role}</p>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                aria-label="Cerrar sesion"
                className="cursor-pointer flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-3 py-1 text-sm font-semibold rounded-btn transition-all duration-200"
              >
                <FiLogOut aria-hidden="true" /> Salir
              </button>
            </div>

            <button
              className="cursor-pointer md:hidden p-2 rounded-btn hover:bg-brand-600 transition focus-visible:ring-2 focus-visible:ring-surface outline-none"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
            >
              {menuOpen ? <FiX size={22} aria-hidden="true" /> : <FiMenu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-brand-800 border-t border-brand-600 px-4 py-3 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-btn text-sm w-full
                  focus-visible:ring-2 focus-visible:ring-surface outline-none
                  ${isActive(link.to) ? 'bg-brand-900 font-semibold' : 'hover:bg-brand-700'}
                `}
                aria-current={isActive(link.to) ? 'page' : undefined}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-brand-600 flex items-center justify-between">
              <div className="text-sm">
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-xs opacity-75">{currentUser.role}</p>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                aria-label="Cerrar sesion"
                className="cursor-pointer flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-3 py-1 text-sm font-semibold rounded-btn transition-all duration-200"
              >
                <FiLogOut aria-hidden="true" /> Salir
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}