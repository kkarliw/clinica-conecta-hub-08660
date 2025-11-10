import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
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
    } catch {}
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    // Redirigir al dashboard correspondiente según el rol
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
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
