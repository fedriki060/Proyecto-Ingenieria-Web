import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
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

// 🔒 Componente para proteger rutas
function PrivateRoute({ children }: { children: React.ReactNode }){
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// 🔄 Redirección inicial
function RootRedirect() {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppStoreProvider>
        <ToastProvider>
          <div className="min-h-screen bg-page">
            <Navbar />
            <Routes>

              {/* 🔥 Redirección al entrar */}
              <Route path="/" element={<RootRedirect />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 🔒 Rutas protegidas */}
              <Route path="/home" element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              } />

              <Route path="/calendar" element={
                <PrivateRoute>
                  <CalendarPage />
                </PrivateRoute>
              } />

              <Route path="/reservations" element={
                <PrivateRoute>
                  <ReservationsPage />
                </PrivateRoute>
              } />

              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } />

              <Route path="/spaces" element={
                <PrivateRoute>
                  <SpacesPage />
                </PrivateRoute>
              } />

              <Route path="/spaces/:id" element={
                <PrivateRoute>
                  <SpaceDetailPage />
                </PrivateRoute>
              } />

              {/* ❌ 404 */}
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