import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { authRoutes } from './routes/auth.routes';
import 'dotenv/config';

const app = fastify({ logger: true });

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  cookie: { cookieName: 'token', signed: false },
});

app.register(fastifyCookie);
app.register(authRoutes);

app.get('/', async () => {
  return { mensagem: 'API da Inception 3D está rodando 100%!' };
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Servidor rodando em http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();