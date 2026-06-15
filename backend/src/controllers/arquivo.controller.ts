import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import { criarPastaNoDrive, buscarPastaDoProjeto, uploadArquivo } from '../lib/drive';
import path from 'node:path';

interface ArquivoParams {
  id: string;
}

export async function uploadArquivoProjeto(
  req: FastifyRequest<{ Params: { idProjeto: string } }>,
  reply: FastifyReply
) {
  const { idProjeto } = req.params;

  const projeto = await prisma.projeto.findUnique({ where: { id: idProjeto } });
  if (!projeto) return reply.status(404).send({ error: 'Projeto não encontrado.' });

  const data = await req.file();
  if (!data) return reply.status(400).send({ error: 'Nenhum arquivo enviado.' });

  const buffer = await data.toBuffer();
  const nomeArquivo = data.filename;
  const mimeType = data.mimetype;
  const tipoExtensao = path.extname(nomeArquivo).replace('.', '');

  let idPasta = await buscarPastaDoProjeto(projeto.titulo);
  if (!idPasta) {
    idPasta = await criarPastaNoDrive(projeto.titulo);
  }

  const { link } = await uploadArquivo(nomeArquivo, mimeType, buffer, idPasta);

  const arquivo = await prisma.arquivo.create({
    data: {
      nomeArquivo,
      urlCaminho: link,
      tipoExtensao,
      idProjeto,
    },
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