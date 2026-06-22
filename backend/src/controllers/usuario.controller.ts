import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

interface UsuarioParams {
  id: string;
}

interface AtualizarUsuarioBody {
  nome?: string;
  email?: string;
  perfilAcesso?: string;
}

interface AtualizarPerfilBody {
  nome?: string;
  email?: string;
  senha?: string;
}

interface CriarUsuarioBody {
  nome: string;
  email: string;
  senha: string;
  perfilAcesso?: string;
}

export async function listarUsuarios(_req: FastifyRequest, reply: FastifyReply) {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, perfilAcesso: true, dataCadastro: true },
    orderBy: { nome: 'asc' },
  });

  return reply.send({ usuarios });
}

export async function criarUsuario(
  req: FastifyRequest<{ Body: CriarUsuarioBody }>,
  reply: FastifyReply
) {
  const { nome, email, senha, perfilAcesso } = req.body;

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) return reply.status(409).send({ error: 'E-mail já cadastrado.' });

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
      perfilAcesso: (perfilAcesso as any) ?? 'USUARIO',
    },
    select: { id: true, nome: true, email: true, perfilAcesso: true, dataCadastro: true },
  });

  return reply.status(201).send({ usuario });
}

// Atualiza o PRÓPRIO perfil (qualquer usuário logado)
export async function atualizarPerfil(
  req: FastifyRequest<{ Body: AtualizarPerfilBody }>,
  reply: FastifyReply
) {
  const { sub } = req.user as { sub: string };
  const { nome, email, senha } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { id: sub } });
  if (!usuario) return reply.status(404).send({ error: 'Usuário não encontrado.' });

  // Se trocou o email, verifica se já não existe em outro usuário
  if (email && email !== usuario.email) {
    const emailEmUso = await prisma.usuario.findUnique({ where: { email } });
    if (emailEmUso) return reply.status(409).send({ error: 'E-mail já está em uso.' });
  }

  const data: any = {
    nome: nome ?? usuario.nome,
    email: email ?? usuario.email,
  };

  if (senha && senha.trim().length > 0) {
    data.senha = await bcrypt.hash(senha, 10);
  }

  const atualizado = await prisma.usuario.update({
    where: { id: sub },
    data,
    select: { id: true, nome: true, email: true, perfilAcesso: true, dataCadastro: true },
  });

  return reply.send({ usuario: atualizado });
}

// Atualiza QUALQUER usuário (apenas ADMIN) — usado na tela de gestão
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