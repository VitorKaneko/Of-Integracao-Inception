import { FastifyInstance } from 'fastify';
import { criarProjeto, listarProjetos, buscarProjeto, atualizarProjeto, deletarProjeto } from '../controllers/projeto.controller';
import { verifyToken } from '../middlewares/auth.middleware';

export async function projetoRoutes(app: FastifyInstance) {
  app.get('/projetos', listarProjetos);
  app.get('/projetos/:id', buscarProjeto);
  app.post('/projetos', { preHandler: [verifyToken] }, criarProjeto);
  app.put('/projetos/:id', { preHandler: [verifyToken] }, atualizarProjeto);
  app.delete('/projetos/:id', { preHandler: [verifyToken] }, deletarProjeto);
}