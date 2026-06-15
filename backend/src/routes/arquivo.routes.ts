import { FastifyInstance } from 'fastify';
import { uploadArquivoProjeto, listarArquivosPorProjeto, deletarArquivo } from '../controllers/arquivo.controller';
import { verifyToken, requirePerfil } from '../middlewares/auth.middleware';

export async function arquivoRoutes(app: FastifyInstance) {
  app.get('/projetos/:idProjeto/arquivos', { preHandler: [verifyToken] }, listarArquivosPorProjeto);

  app.post('/projetos/:idProjeto/upload', {
    preHandler: [verifyToken, requirePerfil('USUARIO', 'ADMIN')],
  }, uploadArquivoProjeto);

  app.delete('/arquivos/:id', {
    preHandler: [verifyToken, requirePerfil('USUARIO', 'ADMIN')],
  }, deletarArquivo);
}