export type PerfilAcesso = 'ADMIN' | 'USUARIO' | 'VISITANTE';
export type StatusImpressao = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
export type Visibilidade = 'PUBLICO' | 'PRIVADO';
export type StatusSolicitacao = 'PENDENTE' | 'APROVADA' | 'RECUSADA';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfilAcesso: PerfilAcesso;
  dataCadastro: string;
}

export interface Projeto {
  id: string;
  titulo: string;
  descricao?: string;
  historicos?: HistoricoProjeto[];
  statusImpressao: StatusImpressao;
  visibilidade: Visibilidade;
  dataCriacao: string;
  idUsuario: string;
  idSolicitacao?: string;
  usuario?: Pick<Usuario, 'id' | 'nome' | 'email'>;
  arquivos?: Arquivo[];
}

export interface Arquivo {
  id: string;
  nomeArquivo: string;
  urlCaminho: string;
  tipoExtensao: string;
  idProjeto: string;
}

export interface HistoricoProjeto {
  id: string;
  statusAnterior: string;
  statusNovo: string;
  dataAlteracao: string;
  idProjeto: string;
}

export interface Solicitacao {
  id: string;
  descricaoPedido: string;
  statusSolicitacao: StatusSolicitacao;
  justificativaRecusa?: string;
  dataSolicitacao: string;
  idUsuarioVisitante: string;
  usuarioVisitante?: Pick<Usuario, 'id' | 'nome' | 'email'>;
}

export interface ConteudoEducacional {
  id: string;
  titulo: string;
  categoria: string;
  urlLink: string;
  idUsuarioAdmin: string;
  usuarioAdmin?: Pick<Usuario, 'id' | 'nome'>;
}