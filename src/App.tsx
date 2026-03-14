import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppStoreProvider } from './context/AppStoreContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import ReservationsPage from './pages/ReservationsPage';
import AdminDashboard from './pages/AdminDashboard';
import StateMessage from './components/ui/StateMessage';
import SpacesPage from './pages/SpacesPage';
import SpaceDetailPage from './pages/SpaceDetailPage';


export function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) {
    document.documentElement.classList.toggle('dark', stored === 'dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

export default function App() {
  return (
    <AuthProvider>
      <AppStoreProvider>
        <ToastProvider>
          <div className="min-h-screen bg-page">
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/spaces" element={<SpacesPage />} />
              <Route path="/spaces/:id" element={<SpaceDetailPage />} />
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
                    <StateMessage
                      type="empty"
                      title="Página no encontrada"
                      description="La página que buscas no existe"
                    />
                  </div>
                }
              />
            </Routes>
          </div>
        </ToastProvider>
      </AppStoreProvider>
    </AuthProvider>
  );
}