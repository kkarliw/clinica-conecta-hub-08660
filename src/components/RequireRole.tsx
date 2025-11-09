import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RequireRoleProps {
  children: ReactNode;
  role: string;
}

export default function RequireRole({ children, role }: RequireRoleProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.rol !== role) {
    // Redirigir al dashboard correspondiente según el rol del usuario
    switch (user.rol) {
      case 'PACIENTE':
        return <Navigate to="/dashboard/paciente" replace />;
      case 'MEDICO':
        return <Navigate to="/dashboard/medico" replace />;
      case 'RECEPCIONISTA':
        return <Navigate to="/dashboard/recepcionista" replace />;
      case 'CUIDADOR':
        return <Navigate to="/cuidador/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/dashboard/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
