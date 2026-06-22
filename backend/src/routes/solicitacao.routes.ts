import type { FastifyInstance } from 'fastify';
import {
  criarSolicitacao,
  listarSolicitacoes,
  listarMinhasSolicitacoes,
  buscarSolicitacao,
  atualizarSolicitacao,
} from '../controllers/solicitacao.controller';
import { verifyToken, requirePerfil } from '../middlewares/auth.middleware';

interface SolicitacaoBody {
  descricaoPedido: string;
}

interface SolicitacaoParams {
  id: string;
}

interface AtualizarSolicitacaoBody {
  statusSolicitacao: string;
  justificativaRecusa?: string;
}

export async function solicitacaoRoutes(app: FastifyInstance) {
  app.post<{ Body: SolicitacaoBody }>(
    '/solicitacoes',
    { preHandler: [verifyToken] },
    criarSolicitacao
  );

  app.get(
    '/solicitacoes/minhas',
    { preHandler: [verifyToken] },
    listarMinhasSolicitacoes
  );

  app.get(
    '/solicitacoes',
    { preHandler: [verifyToken, requirePerfil('ADMIN')] },
    listarSolicitacoes
  );

  app.get<{ Params: SolicitacaoParams }>(
    '/solicitacoes/:id',
    { preHandler: [verifyToken, requirePerfil('ADMIN')] },
    buscarSolicitacao
  );

  app.put<{ Params: SolicitacaoParams; Body: AtualizarSolicitacaoBody }>(
    '/solicitacoes/:id',
    { preHandler: [verifyToken, requirePerfil('ADMIN')] },
    atualizarSolicitacao
  );
}