import { api } from './api';
import { Usuario, PerfilAcesso } from '../types/api.types';

interface AtualizarUsuarioInput {
  nome?: string;
  email?: string;
  perfilAcesso?: PerfilAcesso;
}

export const usuarioService = {
  async listar(): Promise<Usuario[]> {
    const { data } = await api.get<{ usuarios: Usuario[] }>('/usuarios');
    return data.usuarios;
  },

  async atualizar(id: string, input: AtualizarUsuarioInput): Promise<Usuario> {
    const { data } = await api.put<{ usuario: Usuario }>(`/usuarios/${id}`, input);
    return data.usuario;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};