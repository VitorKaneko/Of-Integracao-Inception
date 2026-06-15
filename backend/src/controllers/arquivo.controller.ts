import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

interface ArquivoBody {
  nomeArquivo: string;
  urlCaminho: string;
  tipoExtensao: string;
  idProjeto: string;
}

interface ArquivoParams {
  id: string;
}

export async function criarArquivo(
  req: FastifyRequest<{ Body: ArquivoBody }>,
  reply: FastifyReply
) {
  const { nomeArquivo, urlCaminho, tipoExtensao, idProjeto } = req.body;

  const projeto = await prisma.projeto.findUnique({ where: { id: idProjeto } });
  if (!projeto) return reply.status(404).send({ error: 'Projeto não encontrado.' });

  const arquivo = await prisma.arquivo.create({
    data: { nomeArquivo, urlCaminho, tipoExtensao, idProjeto },
  });

  return reply.status(201).send({ arquivo });
}

export async function listarArquivosPorProjeto(
  req: FastifyRequest<{ Params: { idProjeto: string } }>,
  reply: FastifyReply
) {
  const { idProjeto } = req.params;

  const arquivos = await prisma.arquivo.findMany({
    where: { idProjeto },
  });

  return reply.send({ arquivos });
}

export async function deletarArquivo(
  req: FastifyRequest<{ Params: ArquivoParams }>,
  reply: FastifyReply
) {
  const { id } = req.params;

  const arquivo = await prisma.arquivo.findUnique({ where: { id } });
  if (!arquivo) return reply.status(404).send({ error: 'Arquivo não encontrado.' });

  await prisma.arquivo.delete({ where: { id } });

  return reply.send({ message: 'Arquivo deletado com sucesso.' });
}