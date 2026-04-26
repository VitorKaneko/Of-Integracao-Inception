import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Edit3,
  Trash2,
  Download,
  Plus,
  ChevronRight,
  Box,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { mockProjects } from "../data/mockData";
import { DecoSquare } from "../components/DecoSquare";
import "./ProjectDetailPage.css";

const STATUS_PIPELINE = ["Solicitado", "Em Analise", "Em Andamento", "Concluido"];

const PROJECT_FILES = [
  { name: "prototipo_base_v3", ext: "stl", size: "12.4 MB" },
  { name: "tampa_superior_v2", ext: "stl", size: "8.2 MB" },
  { name: "componente_interno", ext: "obj", size: "5.7 MB" },
];

const PROJECT_HISTORY = [
  {
    id: "h-1",
    text: "Status alterado para \"Em Andamento\" por Admin",
    date: "29/03/2024 - 14:30",
  },
  {
    id: "h-2",
    text: "Arquivo prototipo_base_v3.stl adicionado por Carlos Henrique Santos",
    date: "28/03/2024 - 16:12",
  },
  {
    id: "h-3",
    text: "Projeto criado por Carlos Henrique Santos",
    date: "27/03/2024 - 09:48",
  },
];

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = mockProjects.find((p) => p.id === id) ?? mockProjects[8];

  const currentIndex = 2;

  return (
    <>
      <div className="breadcrumb">
        <Link to="/projetos">Projetos</Link>
        <ChevronRight size={14} />
        <span>{project.title}</span>
      </div>

      <div className="project-detail-grid">
        <div className="card project-summary">
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>{project.title}</h1>

          <div className="project-summary__owner">
            <div className="avatar">{project.ownerInitials}</div>
            <div>
              <p className="muted" style={{ fontSize: 12 }}>
                Responsavel
              </p>
              <p style={{ fontWeight: 500 }}>{project.owner}</p>
            </div>
          </div>

          <hr className="hr" />

          <p className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
            Descricao do Projeto
          </p>
          <p className="project-summary__description">
            {project.description ??
              "Projeto interno em fase de desenvolvimento. Detalhes serao publicados em breve."}
          </p>

          <hr className="hr" />

          <div className="project-summary__actions">
            <button className="btn btn-primary">
              <Edit3 size={14} /> Editar Projeto
            </button>
            <button className="btn btn-danger">
              <Trash2 size={14} /> Excluir
            </button>
          </div>
        </div>

        <aside className="card project-status">
          <h3 className="card-title">Status do Projeto</h3>
          <ul className="status-pipeline">
            {STATUS_PIPELINE.map((s, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <li key={s} className={"status-step" + (active ? " status-step--active" : "")}>
                  {done ? (
                    <CheckCircle2 size={20} color="var(--brand)" />
                  ) : active ? (
                    <span className="status-step__active-dot">
                      <Circle size={20} color="var(--brand)" />
                      <span className="status-step__inner-dot" />
                    </span>
                  ) : (
                    <Circle size={20} color="var(--border-strong)" />
                  )}
                  <span className={done || active ? "" : "muted"}>{s}</span>
                </li>
              );
            })}
          </ul>

          <div className="field" style={{ marginTop: 18 }}>
            <label htmlFor="status">Alterar Status</label>
            <select id="status" className="select" defaultValue="Em Andamento">
              <option>Solicitado</option>
              <option>Em Analise</option>
              <option>Em Andamento</option>
              <option>Concluido</option>
            </select>
          </div>
        </aside>
      </div>

      <section className="card" style={{ marginTop: 18 }}>
        <h3 className="card-title" style={{ marginBottom: 14 }}>
          Arquivos do Projeto
        </h3>
        <div className="project-files">
          {PROJECT_FILES.map((f) => (
            <div key={f.name} className="project-file">
              <div className="project-file__icon">
                <Box size={20} />
              </div>
              <div className="project-file__body">
                <div className="project-file__name">{f.name}</div>
                <div className="project-file__meta">
                  <span className="tag">.{f.ext}</span>
                  <span className="muted" style={{ fontSize: 12 }}>
                    {f.size}
                  </span>
                </div>
              </div>
              <button className="icon-btn" aria-label="Download">
                <Download size={15} />
              </button>
            </div>
          ))}

          <button className="project-file project-file--add" onClick={() => navigate("/arquivos")}>
            <Plus size={16} />
            Adicionar Arquivo
          </button>
        </div>
      </section>

      <section className="card" style={{ marginTop: 18, position: "relative" }}>
        <DecoSquare position="top-right" size={70} style={{ opacity: 0.3, top: 16, right: 16 }} />
        <h3 className="card-title" style={{ marginBottom: 16 }}>
          Historico de Alteracoes
        </h3>
        <ul className="history-list">
          {PROJECT_HISTORY.map((h) => (
            <li key={h.id} className="history-item">
              <span className="history-item__dot" />
              <div>
                <p style={{ fontSize: 13.5 }}>{h.text}</p>
                <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  {h.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
