import type { FastifyInstance } from 'fastify';
import { listarUsuarios, atualizarUsuario, deletarUsuario } from '../controllers/usuario.controller';
import { verifyToken, requirePerfil } from '../middlewares/auth.middleware';

interface UsuarioParams {
  id: string;
}

interface AtualizarUsuarioBody {
  nome?: string;
  email?: string;
  perfilAcesso?: string;
}

export async function usuarioRoutes(app: FastifyInstance) {
  app.get(
    '/usuarios',
    { preHandler: [verifyToken, requirePerfil('ADMIN')] },
    listarUsuarios
  );

  app.put<{ Params: UsuarioParams; Body: AtualizarUsuarioBody }>(
    '/usuarios/:id',
    { preHandler: [verifyToken, requirePerfil('ADMIN')] },
    atualizarUsuario
  );

  app.delete<{ Params: UsuarioParams }>(
    '/usuarios/:id',
    { preHandler: [verifyToken, requirePerfil('ADMIN')] },
    deletarUsuario
  );
}