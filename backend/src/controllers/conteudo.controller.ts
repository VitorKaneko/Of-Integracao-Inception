import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

interface ConteudoBody {
  titulo: string;
  categoria: string;
  urlLink: string;
}

interface ConteudoParams {
  id: string;
}

export async function criarConteudo(
  req: FastifyRequest<{ Body: ConteudoBody }>,
  reply: FastifyReply
) {
  const { sub } = req.user as { sub: string };
  const { titulo, categoria, urlLink } = req.body;

  const conteudo = await prisma.conteudoEducacional.create({
    data: { titulo, categoria, urlLink, idUsuarioAdmin: sub },
  });

  return reply.status(201).send({ conteudo });
}

export async function listarConteudos(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  const conteudos = await prisma.conteudoEducacional.findMany({
    include: {
      usuarioAdmin: { select: { id: true, nome: true } },
    },
    orderBy: { titulo: 'asc' },
  });

  return reply.send({ conteudos });
}

export async function buscarConteudo(
  req: FastifyRequest<{ Params: ConteudoParams }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const conteudo = await prisma.conteudoEducacional.findUnique({
    where: { id },
    include: { usuarioAdmin: { select: { id: true, nome: true } } },
  });

  if (!conteudo) return reply.status(404).send({ error: 'Conteúdo não encontrado.' });

  return reply.send({ conteudo });
}

export async function atualizarConteudo(
  req: FastifyRequest<{ Params: ConteudoParams; Body: ConteudoBody }>,
  reply: FastifyReply
) {
  const { id } = req.params;
  const { titulo, categoria, urlLink } = req.body;

  const conteudo = await prisma.conteudoEducacional.findUnique({ where: { id } });
  if (!conteudo) return reply.status(404).send({ error: 'Conteúdo não encontrado.' });

  const atualizado = await prisma.conteudoEducacional.update({
    where: { id },
    data: { titulo, categoria, urlLink },
  });

  return reply.send({ conteudo: atualizado });
}

export async function deletarConteudo(
  req: FastifyRequest<{ Params: ConteudoParams }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const conteudo = await prisma.conteudoEducacional.findUnique({ where: { id } });
  if (!conteudo) return reply.status(404).send({ error: 'Conteúdo não encontrado.' });

  await prisma.conteudoEducacional.delete({ where: { id } });

  return reply.send({ message: 'Conteúdo deletado com sucesso.' });
}