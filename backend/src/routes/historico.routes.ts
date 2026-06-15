import { FastifyInstance } from 'fastify';
import { listarHistoricoPorProjeto } from '../controllers/historico.controller';
import { verifyToken } from '../middlewares/auth.middleware';

export async function historicoRoutes(app: FastifyInstance) {
  app.get('/projetos/:idProjeto/historico', { preHandler: [verifyToken] }, listarHistoricoPorProjeto);
}