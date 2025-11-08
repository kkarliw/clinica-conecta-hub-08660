import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

type UserRole = 'PACIENTE' | 'MEDICO' | 'ADMIN';

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
      const response = await api.post('/auth/login', { email: correo, password });
      // El backend devuelve { token, rol, nombre, id } directamente
      const { token: newToken, rol, nombre, id } = response.data;
      
      // Construir objeto user compatible con el frontend
      const newUser: User = {
        id: id || 0,
        nombre,
        correo,
        rol: rol as UserRole,
        verificado: true
      };

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('healix_token', newToken);
      localStorage.setItem('healix_user', JSON.stringify(newUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      switch (rol as UserRole) {
        case 'PACIENTE':
          navigate('/dashboard/paciente');
          break;
        case 'MEDICO':
          navigate('/dashboard/medico');
          break;
        case 'ADMIN':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejo de errores específicos con mensajes personalizados
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 401:
            throw new Error(serverMessage || 'Credenciales incorrectas. Por favor verifica tu correo y contraseña.');
          case 403:
            throw new Error(serverMessage || 'Acceso denegado. Tu cuenta puede estar inactiva o sin permisos.');
          case 404:
            throw new Error(serverMessage || 'Usuario no encontrado. Verifica tu correo electrónico.');
          case 400:
            throw new Error(serverMessage || 'Datos de inicio de sesión inválidos. Verifica los campos.');
          default:
            throw new Error(serverMessage || 'Error al iniciar sesión. Inténtalo de nuevo.');
        }
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        throw new Error('Error inesperado. Por favor intenta de nuevo.');
      }
    }
  };

  const register = async (data: any) => {
    try {
      // Mapear los campos del frontend al formato del backend
      const payload = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.correo, // Mapear correo -> email
        password: data.password,
        telefono: data.telefono,
        rol: data.rol,
        // Campos específicos por rol
        especialidad: data.especialidad,
        numeroLicencia: data.numeroLicencia,
        campo: data.campo,
        claveAdmin: data.claveAdmin
      };

      const response = await api.post('/auth/register', payload);
      
      // El backend puede devolver diferentes respuestas
      // Adaptarse según la implementación del backend
      return response.data;
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Manejo de errores específicos con mensajes personalizados
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
        navigate('/dashboard/paciente');
        break;
      case 'MEDICO':
        navigate('/dashboard/medico');
        break;
      case 'ADMIN':
        navigate('/dashboard/admin');
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
