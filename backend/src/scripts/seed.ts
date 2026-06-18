import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Iniciando seed...');

  const usuarios = [
    { nome: 'Carlos Henrique Santos', email: 'carlos.santos@inception3d.com', senha: 'carlos123', perfil: 'ADMIN' },
    { nome: 'Maria Fernanda Costa',   email: 'maria.costa@inception3d.com',  senha: 'maria123',  perfil: 'ADMIN' },
    { nome: 'Roberto Almeida Silva',  email: 'roberto.silva@inception3d.com',senha: 'roberto123',perfil: 'USUARIO' },
    { nome: 'Ana Silva',              email: 'ana.silva@inception3d.com',    senha: 'ana123',    perfil: 'USUARIO' },
    { nome: 'Pedro Santos Visitante', email: 'pedro.visitante@external.com', senha: 'pedro123', perfil: 'VISITANTE' },
  ];

  for (const u of usuarios) {
    const existe = await prisma.usuario.findUnique({ where: { email: u.email } });
    if (existe) {
      console.log(`⏭️  Usuário já existe: ${u.email}`);
      continue;
    }

    const senhaHash = await bcrypt.hash(u.senha, 10);
    await prisma.usuario.create({
      data: {
        nome: u.nome,
        email: u.email,
        senha: senhaHash,
        perfilAcesso: u.perfil as any,
      },
    });
    console.log(`✅ Criado: ${u.email}`);
  }

  console.log('✅ Seed concluído!');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);