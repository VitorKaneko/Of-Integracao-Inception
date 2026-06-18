import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

interface UsuarioParams {
  id: string;
}

interface AtualizarUsuarioBody {
  nome?: string;
  email?: string;
  perfilAcesso?: string;
}

export async function listarUsuarios(_req: FastifyRequest, reply: FastifyReply) {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      perfilAcesso: true,
      dataCadastro: true,
    },
    orderBy: { nome: 'asc' },
  });

  return reply.send({ usuarios });
}

export async function atualizarUsuario(
  req: FastifyRequest<{ Params: UsuarioParams; Body: AtualizarUsuarioBody }>,
  reply: FastifyReply
) {
  const { id } = req.params;
  const { nome, email, perfilAcesso } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) return reply.status(404).send({ error: 'Usuário não encontrado.' });

  const atualizado = await prisma.usuario.update({
    where: { id },
    data: {
      nome: nome ?? usuario.nome,
      email: email ?? usuario.email,
      perfilAcesso: (perfilAcesso as any) ?? usuario.perfilAcesso,
    },
    select: { id: true, nome: true, email: true, perfilAcesso: true, dataCadastro: true },
  });

  return reply.send({ usuario: atualizado });
}

export async function deletarUsuario(
  req: FastifyRequest<{ Params: UsuarioParams }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) return reply.status(404).send({ error: 'Usuário não encontrado.' });

  await prisma.usuario.delete({ where: { id } });

  return reply.send({ message: 'Usuário deletado com sucesso.' });
}