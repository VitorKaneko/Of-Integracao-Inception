import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

interface RegisterBody {
  nome: string;
  email: string;
  senha: string;
}

interface LoginBody {
  email: string;
  senha: string;
}

export async function register(
  req: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { nome, email, senha } = req.body;

  const userExists = await prisma.usuario.findUnique({ where: { email } });
  if (userExists) {
    return reply.status(409).send({ error: 'E-mail já cadastrado.' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const user = await prisma.usuario.create({
    data: { nome, email, senha: senhaHash },
  });

  const token = await reply.jwtSign({ sub: user.id, email: user.email });

  reply.setCookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return reply.status(201).send({
    token,
    user: { id: user.id, nome: user.nome, email: user.email, perfilAcesso: user.perfilAcesso },
  });
}

export async function login(
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const { email, senha } = req.body;

  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' });
  }

  const senhaMatch = await bcrypt.compare(senha, user.senha);
  if (!senhaMatch) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' });
  }

  const token = await reply.jwtSign({ sub: user.id, email: user.email });

  reply.setCookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return reply.send({
    token,
    user: { id: user.id, nome: user.nome, email: user.email, perfilAcesso: user.perfilAcesso },
  });
}

export async function logout(_req: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie('token', { path: '/' })
    .send({ message: 'Logout realizado com sucesso.' });
}

export async function me(req: FastifyRequest, reply: FastifyReply) {
  const { sub } = req.user as { sub: string };

  const user = await prisma.usuario.findUnique({
    where: { id: sub },
    select: { id: true, nome: true, email: true, perfilAcesso: true, dataCadastro: true },
  });

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado.' });
  }

  return reply.send({ user });
}