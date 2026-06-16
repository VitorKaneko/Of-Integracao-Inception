import { api } from './api';
import { Arquivo } from '../types/api.types';

export const arquivoService = {
  async listarPorProjeto(idProjeto: string): Promise<Arquivo[]> {
    const { data } = await api.get<{ arquivos: Arquivo[] }>(`/projetos/${idProjeto}/arquivos`);
    return data.arquivos;
  },

  async upload(idProjeto: string, file: File, onProgress?: (pct: number) => void): Promise<Arquivo> {
    const form = new FormData();
    form.append('file', file);

    const { data } = await api.post<{ arquivo: Arquivo }>(
      `/projetos/${idProjeto}/upload`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
    return data.arquivo;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(`/arquivos/${id}`);
  },
};