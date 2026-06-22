import type { FastifyInstance } from 'fastify';
import {
  listarUsuarios,
  criarUsuario,
  atualizarPerfil,
  atualizarUsuario,
  deletarUsuario,
} from '../controllers/usuario.controller';
import { verifyToken, requirePerfil } from '../middlewares/auth.middleware';

interface UsuarioParams {
  id: string;
}

interface AtualizarUsuarioBody {
  nome?: string;
  email?: string;
  perfilAcesso?: string;
}

interface AtualizarPerfilBody {
  nome?: string;
  email?: string;
  senha?: string;
}

interface CriarUsuarioBody {
  nome: string;
  email: string;
  senha: string;
  perfilAcesso?: string;
}

export async function usuarioRoutes(app: FastifyInstance) {
  // Próprio perfil — qualquer usuário logado
  app.put<{ Body: AtualizarPerfilBody }>(
    '/usuarios/perfil',
    { preHandler: [verifyToken] },
    atualizarPerfil
  );

  // Gestão — apenas ADMIN
  app.get(
    '/usuarios',
    { preHandler: [verifyToken, requirePerfil('ADMIN')] },
    listarUsuarios
  );

  app.post<{ Body: CriarUsuarioBody }>(
    '/usuarios',
    { preHandler: [verifyToken, requirePerfil('ADMIN')] },
    criarUsuario
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