import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

interface ProjetoBody {
  titulo: string;
  descricao?: string;
  statusImpressao?: string;
  visibilidade?: string;
  idSolicitacao?: string;
}

interface ProjetoParams {
  id: string;
}

export async function criarProjeto(
  req: FastifyRequest<{ Body: ProjetoBody }>,
  reply: FastifyReply
) {
  const { sub } = req.user as { sub: string };
  const { titulo, descricao, statusImpressao, visibilidade, idSolicitacao } = req.body;

  const projeto = await prisma.projeto.create({
    data: {
      titulo,
      descricao,
      statusImpressao: (statusImpressao as any) ?? 'PENDENTE',
      visibilidade: (visibilidade as any) ?? 'PUBLICO',
      idUsuario: sub,
      idSolicitacao: idSolicitacao ?? null,
    },
  });

  return reply.status(201).send({ projeto });
}

export async function listarProjetos(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  const projetos = await prisma.projeto.findMany({
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      arquivos: true,
    },
    orderBy: { dataCriacao: 'desc' },
  });

  return reply.send({ projetos });
}

export async function buscarProjeto(
  req: FastifyRequest<{ Params: ProjetoParams }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const projeto = await prisma.projeto.findUnique({
    where: { id },
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      arquivos: true,
      historicos: { orderBy: { dataAlteracao: 'desc' } },
      solicitacao: true,
    },
  });

  if (!projeto) return reply.status(404).send({ error: 'Projeto não encontrado.' });

  return reply.send({ projeto });
}

export async function atualizarProjeto(
  req: FastifyRequest<{ Params: ProjetoParams; Body: ProjetoBody }>,
  reply: FastifyReply
) {
  const { id } = req.params;
  const { sub } = req.user as { sub: string };
  const { titulo, descricao, visibilidade } = req.body;
  const novoStatus = (req.body as any).statusImpressao;

  const projeto = await prisma.projeto.findUnique({ where: { id } });
  if (!projeto) return reply.status(404).send({ error: 'Projeto não encontrado.' });

  if (novoStatus && novoStatus !== projeto.statusImpressao) {
    await prisma.historicoProjeto.create({
      data: {
        statusAnterior: projeto.statusImpressao,
        statusNovo: novoStatus,
        idProjeto: id,
      },
    });
  }

  const atualizado = await prisma.projeto.update({
    where: { id },
    data: {
      titulo,
      descricao,
      statusImpressao: novoStatus ?? projeto.statusImpressao,
      visibilidade: (visibilidade as any) ?? projeto.visibilidade,
    },
  });

  return reply.send({ projeto: atualizado });
}

export async function deletarProjeto(
  req: FastifyRequest<{ Params: ProjetoParams }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const projeto = await prisma.projeto.findUnique({ where: { id } });
  if (!projeto) return reply.status(404).send({ error: 'Projeto não encontrado.' });

  await prisma.projeto.delete({ where: { id } });

  return reply.send({ message: 'Projeto deletado com sucesso.' });
}