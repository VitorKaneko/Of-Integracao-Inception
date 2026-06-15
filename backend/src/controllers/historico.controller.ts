import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

export async function listarHistoricoPorProjeto(
  req: FastifyRequest<{ Params: { idProjeto: string } }>,
  reply: FastifyReply
) {
  const { idProjeto } = req.params;

  const historicos = await prisma.historicoProjeto.findMany({
    where: { idProjeto },
    orderBy: { dataAlteracao: 'desc' },
  });

  return reply.send({ historicos });
}