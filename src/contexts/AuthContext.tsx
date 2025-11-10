import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

type UserRole = 'PACIENTE' | 'MEDICO' | 'RECEPCIONISTA' | 'ADMIN' | 'CUIDADOR';

interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
  verificado: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (correo: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  devLogin: (rol: UserRole) => void; // Nuevo método para desarrollo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar token y usuario del localStorage al iniciar
    const storedToken = localStorage.getItem('healix_token');
    const storedUser = localStorage.getItem('healix_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Configurar token en axios
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (correo: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { 
        email: correo, 
        password 
      });
      
      const { token: newToken, id, nombre, email, rol } = response.data;
      
      const newUser: User = {
        id,
        nombre,
        correo: email,
        rol: rol as UserRole,
        verificado: true
      };

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('healix_token', newToken);
      localStorage.setItem('healix_user', JSON.stringify(newUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Redirigir según el rol
      switch (rol as UserRole) {
        case 'PACIENTE':
          navigate('/paciente/dashboard', { replace: true });
          break;
        case 'MEDICO':
          navigate('/medico/dashboard', { replace: true });
          break;
        case 'RECEPCIONISTA':
          navigate('/recepcion/dashboard', { replace: true });
          break;
        case 'CUIDADOR':
          navigate('/cuidador/dashboard', { replace: true });
          break;
        case 'ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Credenciales incorrectas';
      throw new Error(errorMsg);
    }
  };

  const register = async (data: any) => {
    try {
      // Backend Java Spark espera { nombre, email, password, rol }
      const payload = {
        nombre: data.nombre,
        email: data.correo,
        password: data.password,
        rol: data.rol
      };

      const response = await api.post('/auth/register', payload);
      
      return response.data;
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 400:
            throw new Error(serverMessage || 'Datos de registro inválidos. Verifica todos los campos.');
          case 401:
            throw new Error(serverMessage || 'No autorizado. La clave de administrador es incorrecta.');
          case 403:
            throw new Error(serverMessage || 'Acceso denegado. No tienes permisos para crear este tipo de cuenta.');
          case 404:
            throw new Error(serverMessage || 'Servicio de registro no disponible.');
          case 409:
            throw new Error(serverMessage || 'El correo electrónico ya está registrado. Intenta iniciar sesión.');
          default:
            throw new Error(serverMessage || 'Error al crear la cuenta. Inténtalo de nuevo.');
        }
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        throw new Error('Error inesperado. Por favor intenta de nuevo.');
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('healix_token');
    localStorage.removeItem('healix_user');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  // Modo desarrollo - acceso sin backend
  const devLogin = (rol: UserRole) => {
    const fakeToken = 'dev-token-' + Date.now();
    const fakeUser: User = {
      id: 999,
      nombre: 'Usuario Dev',
      correo: 'dev@healix.com',
      rol,
      verificado: true
    };

    setToken(fakeToken);
    setUser(fakeUser);
    localStorage.setItem('healix_token', fakeToken);
    localStorage.setItem('healix_user', JSON.stringify(fakeUser));

    // Redirigir según el rol
    switch (rol) {
      case 'PACIENTE':
        navigate('/paciente/dashboard');
        break;
      case 'MEDICO':
        navigate('/medico/dashboard');
        break;
      case 'RECEPCIONISTA':
        navigate('/recepcion/dashboard');
        break;
      case 'CUIDADOR':
        navigate('/cuidador/dashboard');
        break;
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
        devLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
