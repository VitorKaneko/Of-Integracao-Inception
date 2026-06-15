import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function register(
  req: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return reply.status(409).send({ error: 'E-mail já cadastrado.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
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
    user: { id: user.id, name: user.name, email: user.email },
  });
}

export async function login(
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.status(401).send({ error: 'Credenciais inválidas.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
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
    user: { id: user.id, name: user.name, email: user.email },
  });
}

export async function logout(_req: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie('token', { path: '/' })
    .send({ message: 'Logout realizado com sucesso.' });
}

export async function me(req: FastifyRequest, reply: FastifyReply) {
  const { sub } = req.user as { sub: string };

  const user = await prisma.user.findUnique({
    where: { id: sub },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado.' });
  }

  return reply.send({ user });
}