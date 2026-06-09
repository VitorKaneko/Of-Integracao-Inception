import { useMemo, useState } from "react";
import { Mail, Phone, Calendar, X, Check } from "lucide-react";
import { mockRequests, ProjectRequest } from "../data/mockData";
import "./RequestsPage.css";

const TABS = ["Todas", "Pendentes", "Aprovadas", "Rejeitadas"] as const;
type Tab = (typeof TABS)[number];

function statusTag(status: ProjectRequest["status"]) {
  if (status === "Pendente") return "tag--solid-warning";
  if (status === "Aprovado") return "tag--solid-success";
  return "tag--solid-danger";
}

export function RequestsPage() {
  const [tab, setTab] = useState<Tab>("Todas");

  const filtered = useMemo(() => {
    if (tab === "Todas") return mockRequests;
    if (tab === "Pendentes") return mockRequests.filter((r) => r.status === "Pendente");
    if (tab === "Aprovadas") return mockRequests.filter((r) => r.status === "Aprovado");
    return mockRequests.filter((r) => r.status === "Rejeitado");
  }, [tab]);

  const pending = mockRequests.filter((r) => r.status === "Pendente").length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Solicitacoes de Projeto</h1>
          <p className="subtitle">Gerencie as solicitacoes recebidas de clientes</p>
        </div>
        {pending > 0 && (
          <span className="tag tag--solid-warning" style={{ fontSize: 12.5 }}>
            {pending} pendente{pending > 1 ? "s" : ""}
          </span>
        )}
      </div>

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

      <div className="requests-list">
        {filtered.map((r) => (
          <article key={r.id} className="request-card card">
            <header className="request-card__header">
              <h3>{r.name}</h3>
              <span className={"tag " + statusTag(r.status)}>{r.status}</span>
            </header>

            <div className="request-card__contact">
              {r.email && (
                <span className="muted">
                  <Mail size={13} /> {r.email}
                </span>
              )}
              {r.phone && (
                <span className="muted">
                  <Phone size={13} /> {r.phone}
                </span>
              )}
            </div>

            <div className="request-card__title">
              <h4>{r.title}</h4>
              <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                Setor: {r.sector}
              </p>
            </div>

            <p className="request-card__description">{r.description}</p>

            <footer className="request-card__footer">
              <span className="muted" style={{ fontSize: 12 }}>
                <Calendar size={13} /> Enviado em {r.submittedAt}
              </span>

              {r.status === "Pendente" && (
                <div className="request-card__actions">
                  <button className="btn btn-danger">
                    <X size={14} /> Rejeitar
                  </button>
                  <button className="btn btn-primary">
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
