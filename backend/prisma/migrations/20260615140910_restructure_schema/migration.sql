/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PerfilAcesso" AS ENUM ('ADMIN', 'USUARIO', 'VISITANTE');

-- CreateEnum
CREATE TYPE "StatusImpressao" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "Visibilidade" AS ENUM ('PUBLICO', 'PRIVADO');

-- CreateEnum
CREATE TYPE "StatusSolicitacao" AS ENUM ('PENDENTE', 'APROVADA', 'RECUSADA');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "perfilAcesso" "PerfilAcesso" NOT NULL DEFAULT 'VISITANTE',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "statusImpressao" "StatusImpressao" NOT NULL DEFAULT 'PENDENTE',
    "visibilidade" "Visibilidade" NOT NULL DEFAULT 'PUBLICO',
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" TEXT NOT NULL,
    "idSolicitacao" TEXT,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arquivo" (
    "id" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "urlCaminho" TEXT NOT NULL,
    "tipoExtensao" TEXT NOT NULL,
    "idProjeto" TEXT NOT NULL,

    CONSTRAINT "Arquivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoProjeto" (
    "id" TEXT NOT NULL,
    "statusAnterior" TEXT NOT NULL,
    "statusNovo" TEXT NOT NULL,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idProjeto" TEXT NOT NULL,

    CONSTRAINT "HistoricoProjeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConteudoEducacional" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "urlLink" TEXT NOT NULL,
    "idUsuarioAdmin" TEXT NOT NULL,

    CONSTRAINT "ConteudoEducacional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitacao" (
    "id" TEXT NOT NULL,
    "descricaoPedido" TEXT NOT NULL,
    "statusSolicitacao" "StatusSolicitacao" NOT NULL DEFAULT 'PENDENTE',
    "justificativaRecusa" TEXT,
    "dataSolicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuarioVisitante" TEXT NOT NULL,

    CONSTRAINT "Solicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_idSolicitacao_fkey" FOREIGN KEY ("idSolicitacao") REFERENCES "Solicitacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arquivo" ADD CONSTRAINT "Arquivo_idProjeto_fkey" FOREIGN KEY ("idProjeto") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoProjeto" ADD CONSTRAINT "HistoricoProjeto_idProjeto_fkey" FOREIGN KEY ("idProjeto") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConteudoEducacional" ADD CONSTRAINT "ConteudoEducacional_idUsuarioAdmin_fkey" FOREIGN KEY ("idUsuarioAdmin") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitacao" ADD CONSTRAINT "Solicitacao_idUsuarioVisitante_fkey" FOREIGN KEY ("idUsuarioVisitante") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
