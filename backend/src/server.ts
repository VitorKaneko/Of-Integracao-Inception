import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = fastify({ logger: true });

app.get('/', async (request, reply) => {
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