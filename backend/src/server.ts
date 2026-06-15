import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import { authRoutes } from './routes/auth.routes';
import { projetoRoutes } from './routes/projeto.routes';
import { arquivoRoutes } from './routes/arquivo.routes';
import { solicitacaoRoutes } from './routes/solicitacao.routes';
import { historicoRoutes } from './routes/historico.routes';
import { conteudoRoutes } from './routes/conteudo.routes';
import 'dotenv/config';

const app = fastify({ logger: true });

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  cookie: { cookieName: 'token', signed: false },
});

app.register(fastifyCookie);
app.register(fastifyMultipart, {
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
app.register(authRoutes);
app.register(projetoRoutes);
app.register(arquivoRoutes);
app.register(solicitacaoRoutes);
app.register(historicoRoutes);
app.register(conteudoRoutes);

app.get('/', async () => {
  return { mensagem: 'API da Inception 3D está rodando 100%!' };
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('Servidor rodando em http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();