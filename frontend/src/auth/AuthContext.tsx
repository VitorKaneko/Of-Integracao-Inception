import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authService } from '../services/auth.service';
import { Usuario } from '../types/api.types';

const TOKEN_KEY = 'inception3d:token';

interface AuthContextValue {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  register: (nome: string, email: string, senha: string, telefone?: string) => Promise<{ ok: true } | { ok: false; error: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authService.me()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user } = await authService.login(email, password);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(user);
      return { ok: true } as const;
    } catch (err: any) {
      const message = err.response?.data?.error ?? 'Erro ao fazer login.';
      return { ok: false, error: message } as const;
    }
  }, []);

    const register = useCallback(async (nome: string, email: string, senha: string, telefone?: string) => {
    try {
      const { token, user } = await authService.register(nome, email, senha, telefone);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(user);
      return { ok: true } as const;
    } catch (err: any) {
      const message = err.response?.data?.error ?? 'Erro ao cadastrar.';
      return { ok: false, error: message } as const;
    }
  }, []);
  const logout = useCallback(async () => {
    await authService.logout().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const atualizado = await authService.me();
      setUser(atualizado);
    } catch {
      // se falhar, mantém o usuário atual
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, logout, register, refreshUser }),
    [user, login, logout, register, refreshUser]
  );

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider />');
  return ctx;
}
