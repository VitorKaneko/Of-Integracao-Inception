import { api } from './api';
import { ConteudoEducacional } from '../types/api.types';

interface ConteudoInput {
  titulo: string;
  categoria: string;
  urlLink: string;
}

export const conteudoService = {
  async listar(): Promise<ConteudoEducacional[]> {
    const { data } = await api.get<{ conteudos: ConteudoEducacional[] }>('/conteudos');
    return data.conteudos;
  },

  async buscar(id: string): Promise<ConteudoEducacional> {
    const { data } = await api.get<{ conteudo: ConteudoEducacional }>(`/conteudos/${id}`);
    return data.conteudo;
  },

  async criar(input: ConteudoInput): Promise<ConteudoEducacional> {
    const { data } = await api.post<{ conteudo: ConteudoEducacional }>('/conteudos', input);
    return data.conteudo;
  },

  async atualizar(id: string, input: ConteudoInput): Promise<ConteudoEducacional> {
    const { data } = await api.put<{ conteudo: ConteudoEducacional }>(`/conteudos/${id}`, input);
    return data.conteudo;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(`/conteudos/${id}`);
  },
};