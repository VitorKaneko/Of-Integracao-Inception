import { Link } from "react-router-dom";
import { Clock, CheckCircle2, PauseCircle, Folder, TrendingUp } from "lucide-react";
import { mockActivities, mockProjects } from "../data/mockData";
import { useAuth } from "../auth/AuthContext";
import "./DashboardPage.css";

export function DashboardPage() {
  const { user } = useAuth();
  const userSector = user?.sector ?? "Projetos";
  const firstName = user?.name.split(" ")[0] ?? "";

  const counts = {
    andamento: mockProjects.filter((p) => p.status === "Em Andamento").length,
    concluidos: mockProjects.filter((p) => p.status === "Concluido").length,
    pausados: mockProjects.filter((p) => p.status === "Pausado").length,
  };

  const myProjects = mockProjects
    .filter((p) => p.sector === userSector && p.status === "Em Andamento")
    .slice(0, 2);

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
              Seus projetos e do seu setor
            </h2>
            <span className="muted" style={{ fontSize: 12 }}>
              Setor: {userSector}
            </span>
          </header>

          <div className="dashboard-projects__list">
            {myProjects.map((p) => (
              <Link
                to={`/projetos/${p.id}`}
                key={p.id}
                className="dashboard-project-row"
              >
                <div className="dashboard-project-row__top">
                  <span className="dashboard-project-row__title">{p.title}</span>
                  <span className="tag">{p.status}</span>
                </div>
                <div className="dashboard-project-row__meta">
                  <span className="tag">{p.sector}</span>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {p.ownerInitials} {p.owner}
                  </span>
                  <span className="muted" style={{ fontSize: 12 }}>
                    Atualizado em {p.updatedAt}
                  </span>
                </div>
                <div className="dashboard-project-row__progress">
                  <div className="progress-row">
                    <span>Progresso</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="progress">
                    <span style={{ width: `${p.progress}%` }} />
                  </div>
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
            {mockActivities.map((a) => (
              <li key={a.id} className="activity-item">
                <span className="activity-item__dot" />
                <div>
                  <p className="activity-item__title">{a.title}</p>
                  <p className="activity-item__subject">{a.subject}</p>
                  <p className="activity-item__meta">
                    <span className="muted">{a.user}</span>
                    <span className="muted">·</span>
                    <span className="muted">{a.timeAgo}</span>
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
