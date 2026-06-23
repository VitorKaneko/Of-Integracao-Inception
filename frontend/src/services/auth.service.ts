import { api } from './api';
import { Usuario } from '../types/api.types';

interface LoginResponse {
  token: string;
  user: Usuario;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { nome: '', email, senha: password });
    return data;
  },

async register(nome: string, email: string, senha: string, telefone?: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/register', { nome, email, senha, telefone });
  return data;
},

  async me(): Promise<Usuario> {
    const { data } = await api.get<{ user: Usuario }>('/auth/me');
    return data.user;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};