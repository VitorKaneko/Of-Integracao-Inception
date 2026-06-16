import { api } from './api';
import { Projeto, StatusImpressao, Visibilidade } from '../types/api.types';

interface CriarProjetoInput {
  titulo: string;
  descricao?: string;
  statusImpressao?: StatusImpressao;
  visibilidade?: Visibilidade;
  idSolicitacao?: string;
}

export const projetoService = {
  async listar(): Promise<Projeto[]> {
    const { data } = await api.get<{ projetos: Projeto[] }>('/projetos');
    return data.projetos;
  },

  async buscar(id: string): Promise<Projeto> {
    const { data } = await api.get<{ projeto: Projeto }>(`/projetos/${id}`);
    return data.projeto;
  },

  async criar(input: CriarProjetoInput): Promise<Projeto> {
    const { data } = await api.post<{ projeto: Projeto }>('/projetos', input);
    return data.projeto;
  },

  async atualizar(id: string, input: Partial<CriarProjetoInput>): Promise<Projeto> {
    const { data } = await api.put<{ projeto: Projeto }>(`/projetos/${id}`, input);
    return data.projeto;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(`/projetos/${id}`);
  },
};