import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { UserRole, Consultorio } from '@/types';

interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
  verificado: boolean;
  consultorioId?: number;
  consultorio?: Consultorio;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (correo: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
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
      const response = await api.post('/auth/login', { correo, password });

      // El backend devuelve: { token, usuario: { id, nombre, apellido, correo, rol } }
      const data = response.data;
      const token = data.token;
      const userData = data.usuario;

      // Normalizar el rol a mayúsculas
      if (userData.rol) {
        userData.rol = userData.rol.toUpperCase();
      }

      // Construir objeto user
      const newUser: User = {
        id: userData.id,
        nombre: `${userData.nombre} ${userData.apellido}`,
        correo: userData.correo,
        rol: userData.rol as UserRole,
        verificado: true
      };

      // Guardar token en localStorage
      setToken(token);
      setUser(newUser);
      localStorage.setItem('healix_token', token);
      localStorage.setItem('healix_user', JSON.stringify(newUser));

      // Configurar token en axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirigir según el rol
      const intendedPath = localStorage.getItem('healix_intended_path');
      if (intendedPath) {
        localStorage.removeItem('healix_intended_path');
        navigate(intendedPath);
      } else {
        switch (userData.rol) {
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
          case 'CONSULTORIO_ADMIN':
            navigate('/consultorio/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Error en login:', error);

      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;

        switch (status) {
          case 401:
            throw new Error(serverMessage || 'Credenciales incorrectas');
          case 403:
            throw new Error(serverMessage || 'Acceso denegado');
          case 404:
            throw new Error(serverMessage || 'Usuario no encontrado');
          case 400:
            throw new Error(serverMessage || 'Datos inválidos');
          default:
            throw new Error(serverMessage || 'Error al iniciar sesión');
        }
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error(error.message || 'Error inesperado');
      }
    }
  };

  const register = async (data: any) => {
    try {
      // El backend espera: { correo, password, rol, nombre, apellido, telefono?, numeroLicencia?, ... }
      const payload: any = {
        correo: data.correo,
        password: data.password,
        rol: data.rol,
        nombre: data.nombre,
        apellido: data.apellido,
      };

      // Agregar campos específicos según el rol
      if (data.telefono) {
        payload.telefono = data.telefono;
      }

      if (data.rol === 'MEDICO' && data.numeroLicencia) {
        payload.numeroLicencia = data.numeroLicencia;
      }

      if (data.rol === 'ADMIN' && data.claveAdmin) {
        payload.claveAdmin = data.claveAdmin;
      }

      const response = await api.post('/auth/register', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error en registro:', error);

      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;

        switch (status) {
          case 400:
            throw new Error(serverMessage || 'Datos de registro inválidos');
          case 401:
            throw new Error(serverMessage || 'Clave de administrador incorrecta');
          case 403:
            throw new Error(serverMessage || 'No tienes permisos para crear este tipo de cuenta');
          case 409:
            throw new Error(serverMessage || 'El correo electrónico ya está registrado');
          default:
            throw new Error(serverMessage || 'Error al crear la cuenta');
        }
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw new Error(error.message || 'Error inesperado');
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
