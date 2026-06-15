import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

interface SolicitacaoBody {
  descricaoPedido: string;
}

interface AtualizarSolicitacaoBody {
  statusSolicitacao: string;
  justificativaRecusa?: string;
}

interface SolicitacaoParams {
  id: string;
}

export async function criarSolicitacao(
  req: FastifyRequest<{ Body: SolicitacaoBody }>,
  reply: FastifyReply
) {
  const { sub } = req.user as { sub: string };
  const { descricaoPedido } = req.body;

  const solicitacao = await prisma.solicitacao.create({
    data: { descricaoPedido, idUsuarioVisitante: sub },
  });

  return reply.status(201).send({ solicitacao });
}

export async function listarSolicitacoes(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  const solicitacoes = await prisma.solicitacao.findMany({
    include: {
      usuarioVisitante: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { dataSolicitacao: 'desc' },
  });

  return reply.send({ solicitacoes });
}

export async function buscarSolicitacao(
  req: FastifyRequest<{ Params: SolicitacaoParams }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const solicitacao = await prisma.solicitacao.findUnique({
    where: { id },
    include: {
      usuarioVisitante: { select: { id: true, nome: true, email: true } },
      projetos: true,
    },
  });

  if (!solicitacao) return reply.status(404).send({ error: 'Solicitação não encontrada.' });

  return reply.send({ solicitacao });
}

export async function atualizarSolicitacao(
  req: FastifyRequest<{ Params: SolicitacaoParams; Body: AtualizarSolicitacaoBody }>,
  reply: FastifyReply
) {
  const { id } = req.params;
  const { statusSolicitacao, justificativaRecusa } = req.body;

  const solicitacao = await prisma.solicitacao.findUnique({ where: { id } });
  if (!solicitacao) return reply.status(404).send({ error: 'Solicitação não encontrada.' });

  const atualizada = await prisma.solicitacao.update({
    where: { id },
    data: {
      statusSolicitacao: statusSolicitacao as any,
      justificativaRecusa: justificativaRecusa ?? null,
    },
  });

  return reply.send({ solicitacao: atualizada });
}