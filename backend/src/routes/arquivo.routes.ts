import { FastifyInstance } from 'fastify';
import { criarArquivo, listarArquivosPorProjeto, deletarArquivo } from '../controllers/arquivo.controller';
import { verifyToken } from '../middlewares/auth.middleware';

export async function arquivoRoutes(app: FastifyInstance) {
  app.get('/projetos/:idProjeto/arquivos', { preHandler: [verifyToken] }, listarArquivosPorProjeto);
  app.post('/arquivos', { preHandler: [verifyToken] }, criarArquivo);
  app.delete('/arquivos/:id', { preHandler: [verifyToken] }, deletarArquivo);
}