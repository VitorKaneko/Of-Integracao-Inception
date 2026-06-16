import { api } from './api';
import { Solicitacao, StatusSolicitacao } from '../types/api.types';

export const solicitacaoService = {
  async listar(): Promise<Solicitacao[]> {
    const { data } = await api.get<{ solicitacoes: Solicitacao[] }>('/solicitacoes');
    return data.solicitacoes;
  },

  async buscar(id: string): Promise<Solicitacao> {
    const { data } = await api.get<{ solicitacao: Solicitacao }>(`/solicitacoes/${id}`);
    return data.solicitacao;
  },

  async criar(descricaoPedido: string): Promise<Solicitacao> {
    const { data } = await api.post<{ solicitacao: Solicitacao }>('/solicitacoes', { descricaoPedido });
    return data.solicitacao;
  },

  async atualizar(id: string, statusSolicitacao: StatusSolicitacao, justificativaRecusa?: string): Promise<Solicitacao> {
    const { data } = await api.put<{ solicitacao: Solicitacao }>(`/solicitacoes/${id}`, {
      statusSolicitacao,
      justificativaRecusa,
    });
    return data.solicitacao;
  },
};