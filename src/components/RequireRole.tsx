import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RequireRoleProps {
  children: ReactNode;
  role: string;
}

export default function RequireRole({ children, role }: RequireRoleProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    try {
      localStorage.setItem('healix_intended_path', location.pathname + location.search + location.hash);
    } catch { }
    return <Navigate to="/login" replace />;
  }

  if (user && user.rol !== role) {
    // Redirigir al dashboard correspondiente según el rol del usuario
    switch (user.rol) {
      case 'PACIENTE':
        return <Navigate to="/paciente/dashboard" replace />;
      case 'MEDICO':
        return <Navigate to="/medico/dashboard" replace />;
      case 'RECEPCIONISTA':
        return <Navigate to="/recepcion/dashboard" replace />;
      case 'CUIDADOR':
        return <Navigate to="/cuidador/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'CONSULTORIO_ADMIN':
        return <Navigate to="/consultorio/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
