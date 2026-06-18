import { FastifyInstance } from 'fastify';
import { listarUsuarios, atualizarUsuario, deletarUsuario } from '../controllers/usuario.controller';
import { verifyToken, requirePerfil } from '../middlewares/auth.middleware';

export async function usuarioRoutes(app: FastifyInstance) {
  app.get('/usuarios', { preHandler: [verifyToken, requirePerfil('ADMIN')] }, listarUsuarios);
  app.put('/usuarios/:id', { preHandler: [verifyToken, requirePerfil('ADMIN')] }, atualizarUsuario);
  app.delete('/usuarios/:id', { preHandler: [verifyToken, requirePerfil('ADMIN')] }, deletarUsuario);
}