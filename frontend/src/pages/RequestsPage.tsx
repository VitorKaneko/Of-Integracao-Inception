import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, X, Check, User, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { solicitacaoService } from "../services/solicitacao.service";
import { useAuth } from "../auth/AuthContext";
import { Solicitacao, StatusSolicitacao } from "../types/api.types";
import "./RequestsPage.css";

const TABS = ["Todas", "Pendentes", "Aprovadas", "Rejeitadas"] as const;
type Tab = (typeof TABS)[number];

function statusTag(status: StatusSolicitacao) {
  if (status === "PENDENTE") return "tag--solid-warning";
  if (status === "APROVADA") return "tag--solid-success";
  return "tag--solid-danger";
}

const STATUS_LABEL: Record<StatusSolicitacao, string> = {
  PENDENTE: "Pendente",
  APROVADA: "Aprovada",
  RECUSADA: "Rejeitada",
};

export function RequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("Todas");

  const isAdmin = user?.perfilAcesso === "ADMIN";

  // Admin busca todas; demais buscam só as suas
  const { data: solicitacoes = [], isLoading } = useQuery({
    queryKey: isAdmin ? ["solicitacoes"] : ["solicitacoes", "minhas"],
    queryFn: isAdmin ? solicitacaoService.listar : solicitacaoService.listarMinhas,
  });

  const atualizarMutation = useMutation({
    mutationFn: ({
      id,
      status,
      justificativa,
    }: {
      id: string;
      status: StatusSolicitacao;
      justificativa?: string;
    }) => solicitacaoService.atualizar(id, status, justificativa),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitacoes"] });
    },
  });

  const filtered = useMemo(() => {
    if (tab === "Todas") return solicitacoes;
    if (tab === "Pendentes") return solicitacoes.filter((r) => r.statusSolicitacao === "PENDENTE");
    if (tab === "Aprovadas") return solicitacoes.filter((r) => r.statusSolicitacao === "APROVADA");
    return solicitacoes.filter((r) => r.statusSolicitacao === "RECUSADA");
  }, [tab, solicitacoes]);

  const pending = solicitacoes.filter((r) => r.statusSolicitacao === "PENDENTE").length;

  function handleAprovar(r: Solicitacao) {
    atualizarMutation.mutate({ id: r.id, status: "APROVADA" });
  }

  function handleRejeitar(r: Solicitacao) {
    const justificativa = prompt("Justificativa da recusa (opcional):") ?? undefined;
    atualizarMutation.mutate({ id: r.id, status: "RECUSADA", justificativa });
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{isAdmin ? "Solicitacoes de Projeto" : "Minhas Solicitacoes"}</h1>
          <p className="subtitle">
            {isAdmin
              ? "Gerencie as solicitacoes recebidas"
              : "Acompanhe suas solicitacoes de projeto"}
          </p>
        </div>
        <div className="page-header__actions" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isAdmin && pending > 0 && (
            <span className="tag tag--solid-warning" style={{ fontSize: 12.5 }}>
              {pending} pendente{pending > 1 ? "s" : ""}
            </span>
          )}
          <button className="btn btn-primary" onClick={() => navigate("/solicitacoes/nova")}>
            <Plus size={15} /> Nova Solicitacao
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={"tab" + (tab === t ? " tab--active" : "")}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {isLoading && <p className="muted">Carregando solicitações...</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="muted" style={{ fontSize: 13 }}>
          {isAdmin
            ? "Nenhuma solicitação encontrada."
            : "Você ainda não fez nenhuma solicitação. Clique em \"Nova Solicitacao\" para começar."}
        </p>
      )}

      <div className="requests-list">
        {(isAdmin ? filtered : solicitacoes).map((r) => (
          <article key={r.id} className="request-card card">
            <header className="request-card__header">
              <h3>{r.usuarioVisitante?.nome ?? user?.nome ?? "Solicitante"}</h3>
              <span className={"tag " + statusTag(r.statusSolicitacao)}>
                {STATUS_LABEL[r.statusSolicitacao]}
              </span>
            </header>

            {isAdmin && r.usuarioVisitante?.email && (
              <div className="request-card__contact">
                <span className="muted">
                  <User size={13} /> {r.usuarioVisitante.email}
                </span>
              </div>
            )}

            <p className="request-card__description" style={{ whiteSpace: "pre-line" }}>
              {r.descricaoPedido}
            </p>

            {r.justificativaRecusa && (
              <p className="muted" style={{ fontSize: 12.5, marginTop: 8, color: "var(--accent-red)" }}>
                Justificativa: {r.justificativaRecusa}
              </p>
            )}

            <footer className="request-card__footer">
              <span className="muted" style={{ fontSize: 12 }}>
                <Calendar size={13} /> Enviado em{" "}
                {new Date(r.dataSolicitacao).toLocaleDateString("pt-BR")}
              </span>

              {isAdmin && r.statusSolicitacao === "PENDENTE" && (
                <div className="request-card__actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRejeitar(r)}
                    disabled={atualizarMutation.isPending}
                  >
                    <X size={14} /> Rejeitar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAprovar(r)}
                    disabled={atualizarMutation.isPending}
                  >
                    <Check size={14} /> Aprovar
                  </button>
                </div>
              )}
            </footer>

            <div className="deco-line" style={{ marginTop: 12 }}>
              <span />
              <span />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}