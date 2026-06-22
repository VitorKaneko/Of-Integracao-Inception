import { api } from './api';
import { Usuario, PerfilAcesso } from '../types/api.types';

interface AtualizarUsuarioInput {
  nome?: string;
  email?: string;
  perfilAcesso?: PerfilAcesso;
}

interface AtualizarPerfilInput {
  nome?: string;
  email?: string;
  senha?: string;
}

interface CriarUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  perfilAcesso?: PerfilAcesso;
}

export const usuarioService = {
  async listar(): Promise<Usuario[]> {
    const { data } = await api.get<{ usuarios: Usuario[] }>('/usuarios');
    return data.usuarios;
  },

  async criar(input: CriarUsuarioInput): Promise<Usuario> {
    const { data } = await api.post<{ usuario: Usuario }>('/usuarios', input);
    return data.usuario;
  },

  async atualizarPerfil(input: AtualizarPerfilInput): Promise<Usuario> {
    const { data } = await api.put<{ usuario: Usuario }>('/usuarios/perfil', input);
    return data.usuario;
  },

  async atualizar(id: string, input: AtualizarUsuarioInput): Promise<Usuario> {
    const { data } = await api.put<{ usuario: Usuario }>(`/usuarios/${id}`, input);
    return data.usuario;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};