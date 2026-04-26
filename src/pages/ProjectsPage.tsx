import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Calendar, User, Activity } from "lucide-react";
import { mockProjects, Sector } from "../data/mockData";
import "./ProjectsPage.css";

const SECTORS: ("Todos" | Sector)[] = [
  "Todos",
  "Projetos",
  "Ensino",
  "Tesouraria",
  "Marketing",
  "RH",
];

function statusTagClass(status: string) {
  if (status === "Em Andamento") return "tag--solid-warning";
  if (status === "Concluido") return "tag--solid-success";
  return "tag--solid-danger";
}

function progressClass(status: string) {
  if (status === "Concluido") return "progress--success";
  if (status === "Pausado") return "progress--danger";
  return "";
}

export function ProjectsPage() {
  const [activeSector, setActiveSector] = useState<"Todos" | Sector>("Todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockProjects.filter((p) => {
      const matchSector = activeSector === "Todos" || p.sector === activeSector;
      const matchSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.owner.toLowerCase().includes(search.toLowerCase());
      return matchSector && matchSearch;
    });
  }, [activeSector, search]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Gestao de Projetos</h1>
          <p className="subtitle">Gerencie e acompanhe todos os seus projetos de impressao 3D</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary">
            <Plus size={16} /> Novo Projeto
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="search-input">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Buscar projetos ou membros..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-pills">
        {SECTORS.map((s) => (
          <button
            key={s}
            className={"pill" + (activeSector === s ? " pill--active" : "")}
            onClick={() => setActiveSector(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filtered.map((p) => (
          <Link to={`/projetos/${p.id}`} key={p.id} className="project-card card card--hoverable">
            <div className="project-card__header">
              <h3 className="project-card__title">{p.title}</h3>
              <span className={"tag " + statusTagClass(p.status)}>{p.status}</span>
            </div>
            <div className="project-card__sector">
              <span className="tag">{p.sector}</span>
            </div>
            <ul className="project-card__meta">
              <li>
                <User size={13} /> {p.owner}
              </li>
              <li>
                <Activity size={13} /> Etapa: <strong>{p.stage}</strong>
              </li>
              <li>
                <Calendar size={13} /> Atualizado em {p.updatedAt}
              </li>
            </ul>
            <div className="project-card__progress">
              <div className="progress-row">
                <span>Progresso</span>
                <span>{p.progress}%</span>
              </div>
              <div className={"progress " + progressClass(p.status)}>
                <span style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
