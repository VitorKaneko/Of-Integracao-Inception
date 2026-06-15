import { FastifyInstance } from 'fastify';
import { criarSolicitacao, listarSolicitacoes, buscarSolicitacao, atualizarSolicitacao } from '../controllers/solicitacao.controller';
import { verifyToken, requirePerfil } from '../middlewares/auth.middleware';

export async function solicitacaoRoutes(app: FastifyInstance) {
  app.post('/solicitacoes', { preHandler: [verifyToken] }, criarSolicitacao);

  app.get('/solicitacoes', {
    preHandler: [verifyToken, requirePerfil('ADMIN')],
  }, listarSolicitacoes);

  app.get('/solicitacoes/:id', {
    preHandler: [verifyToken, requirePerfil('ADMIN')],
  }, buscarSolicitacao);

  app.put('/solicitacoes/:id', {
    preHandler: [verifyToken, requirePerfil('ADMIN')],
  }, atualizarSolicitacao);
}