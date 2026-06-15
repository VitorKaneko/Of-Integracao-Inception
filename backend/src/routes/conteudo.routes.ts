import { FastifyInstance } from 'fastify';
import { criarConteudo, listarConteudos, buscarConteudo, atualizarConteudo, deletarConteudo } from '../controllers/conteudo.controller';
import { verifyToken, requirePerfil } from '../middlewares/auth.middleware';

export async function conteudoRoutes(app: FastifyInstance) {
  app.get('/conteudos', listarConteudos);
  app.get('/conteudos/:id', buscarConteudo);

  app.post('/conteudos', {
    preHandler: [verifyToken, requirePerfil('ADMIN')],
  }, criarConteudo);

  app.put('/conteudos/:id', {
    preHandler: [verifyToken, requirePerfil('ADMIN')],
  }, atualizarConteudo);

  app.delete('/conteudos/:id', {
    preHandler: [verifyToken, requirePerfil('ADMIN')],
  }, deletarConteudo);
}