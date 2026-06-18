import { Link } from "react-router-dom";
import { Clock, CheckCircle2, PauseCircle, Folder, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { projetoService } from "../services/projeto.service";
import { useAuth } from "../auth/AuthContext";
import "./DashboardPage.css";

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.nome.split(" ")[0] ?? "";

  const { data: projetos = [], isLoading } = useQuery({
    queryKey: ["projetos"],
    queryFn: projetoService.listar,
  });

  const counts = {
    andamento: projetos.filter((p) => p.statusImpressao === "EM_ANDAMENTO").length,
    concluidos: projetos.filter((p) => p.statusImpressao === "CONCLUIDO").length,
    pausados: projetos.filter((p) => p.statusImpressao === "CANCELADO").length,
  };

  const myProjects = projetos
    .filter((p) => p.idUsuario === user?.id)
    .slice(0, 2);

  const recentProjects = projetos.slice(0, 5);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Painel</h1>
          <p className="subtitle">
            Bem-vindo{firstName ? `, ${firstName}` : " de volta"} ao Inception 3D
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard
          label="Em Andamento"
          value={counts.andamento}
          icon={<Clock size={22} />}
          color="warning"
        />
        <StatCard
          label="Concluidos"
          value={counts.concluidos}
          icon={<CheckCircle2 size={22} />}
          color="success"
        />
        <StatCard
          label="Pausados"
          value={counts.pausados}
          icon={<PauseCircle size={22} />}
          color="danger"
        />
      </div>

      <div className="dashboard-grid">
        <section className="card dashboard-projects">
          <header className="dashboard-projects__header">
            <h2 className="card-title">
              <Folder size={16} style={{ marginRight: 6, color: "var(--brand)" }} />
              Seus projetos
            </h2>
          </header>

          <div className="dashboard-projects__list">
            {isLoading && <p className="muted">Carregando projetos...</p>}

            {!isLoading && myProjects.length === 0 && (
              <p className="muted" style={{ fontSize: 13, padding: "12px 0" }}>
                Nenhum projeto encontrado.
              </p>
            )}

            {myProjects.map((p) => (
              <Link to={`/projetos/${p.id}`} key={p.id} className="dashboard-project-row">
                <div className="dashboard-project-row__top">
                  <span className="dashboard-project-row__title">{p.titulo}</span>
                  <span className="tag">{p.statusImpressao}</span>
                </div>
                <div className="dashboard-project-row__meta">
                  <span className="muted" style={{ fontSize: 12 }}>
                    Criado em {new Date(p.dataCriacao).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="card dashboard-activity">
          <h2 className="card-title">
            <TrendingUp size={16} style={{ marginRight: 6, color: "var(--brand)" }} />
            Atividade Recente
          </h2>

          <ul className="activity-list">
            {isLoading && <p className="muted">Carregando...</p>}
            {recentProjects.map((p) => (
              <li key={p.id} className="activity-item">
                <span className="activity-item__dot" />
                <div>
                  <p className="activity-item__title">Projeto</p>
                  <p className="activity-item__subject">{p.titulo}</p>
                  <p className="activity-item__meta">
                    <span className="muted">{p.usuario?.nome ?? "—"}</span>
                    <span className="muted">·</span>
                    <span className="muted">
                      {new Date(p.dataCriacao).toLocaleDateString("pt-BR")}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "warning" | "success" | "danger";
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="card stat-card">
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
      </div>
      <div className={`stat-card__icon stat-card__icon--${color}`}>{icon}</div>
    </div>
  );
}