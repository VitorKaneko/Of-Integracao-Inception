import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

export async function verifyToken(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.cookies?.token;
    if (token && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${token}`;
    }
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ error: 'Não autorizado.' });
  }
}

export function requirePerfil(...perfis: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { sub } = req.user as { sub: string };

    const usuario = await prisma.usuario.findUnique({
      where: { id: sub },
      select: { perfilAcesso: true },
    });

    if (!usuario || !perfis.includes(usuario.perfilAcesso)) {
      return reply.status(403).send({ error: 'Acesso negado.' });
    }
  };
}
export async function requireProprietarioOuAdmin(
  req: FastifyRequest<{ Params: { id?: string; idProjeto?: string } }>,
  reply: FastifyReply
) {
  const { sub } = req.user as { sub: string };
  const projetoId = req.params.id ?? req.params.idProjeto;

  if (!projetoId) {
    return reply.status(400).send({ error: 'ID do projeto não informado.' });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: sub },
    select: { perfilAcesso: true },
  });

  if (usuario?.perfilAcesso === 'ADMIN') return;

  const projeto = await prisma.projeto.findUnique({
    where: { id: projetoId },
    select: { idUsuario: true },
  });

  if (!projeto) return reply.status(404).send({ error: 'Projeto não encontrado.' });

  if (projeto.idUsuario !== sub) {
    return reply.status(403).send({ error: 'Acesso negado. Você não é o autor deste projeto.' });
  }
}