import { FastifyInstance } from 'fastify';
import { criarSolicitacao, listarSolicitacoes, buscarSolicitacao, atualizarSolicitacao } from '../controllers/solicitacao.controller';
import { verifyToken } from '../middlewares/auth.middleware';

export async function solicitacaoRoutes(app: FastifyInstance) {
  app.post('/solicitacoes', { preHandler: [verifyToken] }, criarSolicitacao);
  app.get('/solicitacoes', { preHandler: [verifyToken] }, listarSolicitacoes);
  app.get('/solicitacoes/:id', { preHandler: [verifyToken] }, buscarSolicitacao);
  app.put('/solicitacoes/:id', { preHandler: [verifyToken] }, atualizarSolicitacao);
}