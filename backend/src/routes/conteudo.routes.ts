import { FastifyInstance } from 'fastify';
import { criarConteudo, listarConteudos, buscarConteudo, atualizarConteudo, deletarConteudo } from '../controllers/conteudo.controller';
import { verifyToken } from '../middlewares/auth.middleware';

export async function conteudoRoutes(app: FastifyInstance) {
  app.get('/conteudos', listarConteudos);
  app.get('/conteudos/:id', buscarConteudo);
  app.post('/conteudos', { preHandler: [verifyToken] }, criarConteudo);
  app.put('/conteudos/:id', { preHandler: [verifyToken] }, atualizarConteudo);
  app.delete('/conteudos/:id', { preHandler: [verifyToken] }, deletarConteudo);
}