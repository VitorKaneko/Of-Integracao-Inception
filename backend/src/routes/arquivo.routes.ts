import type { FastifyInstance } from 'fastify';
import { uploadArquivoProjeto, listarArquivosPorProjeto, deletarArquivo } from '../controllers/arquivo.controller';
import { verifyToken, requirePerfil } from '../middlewares/auth.middleware';

interface ProjetoParams {
  idProjeto: string;
}

interface ArquivoParams {
  id: string;
}

export async function arquivoRoutes(app: FastifyInstance) {
  app.get<{ Params: ProjetoParams }>(
    '/projetos/:idProjeto/arquivos',
    { preHandler: [verifyToken] },
    listarArquivosPorProjeto
  );

  app.post<{ Params: ProjetoParams }>(
    '/projetos/:idProjeto/upload',
    { preHandler: [verifyToken, requirePerfil('USUARIO', 'ADMIN')] },
    uploadArquivoProjeto
  );

  app.delete<{ Params: ArquivoParams }>(
    '/arquivos/:id',
    { preHandler: [verifyToken, requirePerfil('USUARIO', 'ADMIN')] },
    deletarArquivo
  );
}