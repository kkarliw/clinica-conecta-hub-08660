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
      // Backend puede devolver { token, id, nombre, email, rol } o variantes
      const data = response.data || {};
      const newToken = data.token || data.accessToken || data.jwt;
      const id = data.id ?? data.user?.id ?? 0;
      const nombre = data.nombre ?? data.name ?? data.user?.nombre ?? data.user?.name ?? '';
      const emailResp = data.email ?? data.user?.email ?? correo;

      // Detectar y normalizar rol desde múltiples posibles fuentes del backend
      const normalize = (val: any) =>
        String(val ?? '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .trim();

      const roleMap: Record<string, UserRole> = {
        'PACIENTE': 'PACIENTE',
        'PATIENT': 'PACIENTE',
        'ROLE_PACIENTE': 'PACIENTE',
        'ROLE_PATIENT': 'PACIENTE',

        'MEDICO': 'MEDICO',
        'DOCTOR': 'MEDICO',
        'ROLE_MEDICO': 'MEDICO',
        'ROLE_DOCTOR': 'MEDICO',

        'RECEPCIONISTA': 'RECEPCIONISTA',
        'RECEPCION': 'RECEPCIONISTA',
        'RECEPTIONIST': 'RECEPCIONISTA',
        'ROLE_RECEPCIONISTA': 'RECEPCIONISTA',
        'ROLE_RECEPTIONIST': 'RECEPCIONISTA',

        'CUIDADOR': 'CUIDADOR',
        'CAREGIVER': 'CUIDADOR',
        'ROLE_CUIDADOR': 'CUIDADOR',
        'ROLE_CAREGIVER': 'CUIDADOR',

        'ADMIN': 'ADMIN',
        'ADMINISTRADOR': 'ADMIN',
        'ADMINISTRATOR': 'ADMIN',
        'ROLE_ADMIN': 'ADMIN',
        'ROLE_ADMINISTRATOR': 'ADMIN',
      };

      // 1) Candidatos string en distintas llaves
      const stringCandidates: any[] = [
        data.rol,
        data.role,
        data.perfil,
        data.tipo,
        data.tipoUsuario,
        data.rolNombre,
        data.usuario?.rol,
        data.usuario?.role,
        data.usuario?.perfil,
        data.user?.rol,
        data.user?.role,
        data.user?.perfil,
      ].filter(Boolean);

      // 2) Authorities/roles como arrays (Spring Security / API variadas)
      const authoritiesRaw =
        data.authorities ?? data.user?.authorities ?? data.roles ?? data.user?.roles;
      if (Array.isArray(authoritiesRaw)) {
        for (const a of authoritiesRaw) {
          const entry = typeof a === 'string' ? a : (a?.authority ?? a?.name ?? a?.rol ?? a?.role ?? '');
          if (!entry) continue;
          const key = normalize(String(entry).replace(/^ROLE_/i, 'ROLE_'));
          if (roleMap[key]) stringCandidates.push(key);
        }
      }

      // 3) IDs numéricos de rol
      const roleId =
        data.roleId ?? data.role_id ?? data.user?.roleId ?? data.user?.role_id ?? data.rolId ?? data.idRol;
      let mappedFromId: UserRole | null = null;
      if (typeof roleId === 'number') {
        const idMap: Record<number, UserRole> = {
          1: 'PACIENTE',
          2: 'MEDICO',
          3: 'RECEPCIONISTA',
          4: 'CUIDADOR',
          5: 'ADMIN',
        };
        mappedFromId = idMap[roleId] ?? null;
      }

      // Resolver rol final
      let mappedRole: UserRole | null = null;
      for (const candidate of stringCandidates) {
        const key = normalize(candidate).replace(/^ROLE_/i, 'ROLE_');
        if (roleMap[key]) {
          mappedRole = roleMap[key];
          break;
        }
      }
      if (!mappedRole && mappedFromId) mappedRole = mappedFromId;

      if (!mappedRole) {
        throw new Error('No se pudo determinar tu rol desde la respuesta del servidor. Por favor intenta de nuevo o contacta al administrador.');
      }

      // Construir objeto user compatible con el frontend
      const newUser: User = {
        id: id || 0,
        nombre,
        correo: emailResp,
        rol: mappedRole,
        verificado: true
      };

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('healix_token', newToken);
      localStorage.setItem('healix_user', JSON.stringify(newUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Redirección según la ruta intentada o el rol
      const baseByRole: Record<UserRole, string> = {
        PACIENTE: '/paciente',
        MEDICO: '/medico',
        RECEPCIONISTA: '/recepcion',
        CUIDADOR: '/cuidador',
        ADMIN: '/admin',
      };

      const intendedPath = localStorage.getItem('healix_intended_path');
      if (intendedPath) {
        localStorage.removeItem('healix_intended_path');
        if (intendedPath.startsWith(baseByRole[mappedRole])) {
          navigate(intendedPath, { replace: true });
          return;
        }
      }

      // Fallback: redirigir según rol
      switch (mappedRole) {
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
        default:
          navigate('/paciente/dashboard');
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
