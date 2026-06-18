import { useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projetoService } from "../services/projeto.service";
import { useAuth } from "../auth/AuthContext";
import { StatusImpressao } from "../types/api.types";
import { DecoSquare } from "../components/DecoSquare";
import "./ProjectDetailPage.css";

const STATUS_PIPELINE: StatusImpressao[] = [
  "PENDENTE",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "CANCELADO",
];

const STATUS_LABEL: Record<StatusImpressao, string> = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluido",
  CANCELADO: "Cancelado",
};

export function ProjectDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [novoStatus, setNovoStatus] = useState<StatusImpressao | "">("");

  const { data: project, isLoading } = useQuery({
    queryKey: ["projeto", id],
    queryFn: () => projetoService.buscar(id),
    enabled: !!id,
  });

  const atualizarMutation = useMutation({
    mutationFn: (status: StatusImpressao) =>
      projetoService.atualizar(id, { statusImpressao: status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projeto", id] });
    },
  });

  const deletarMutation = useMutation({
    mutationFn: () => projetoService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projetos"] });
      navigate("/projetos");
    },
  });

  if (isLoading) return <p className="muted">Carregando projeto...</p>;
  if (!project) return <p className="muted">Projeto não encontrado.</p>;

  const currentIndex = STATUS_PIPELINE.indexOf(project.statusImpressao);
  const ehAutor = project.idUsuario === user?.id;
  const ehAdmin = user?.perfilAcesso === "ADMIN";
  const podeEditar = ehAutor || ehAdmin;

  const iniciais = (project.usuario?.nome ?? "")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleAlterarStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as StatusImpressao;
    setNovoStatus(status);
    if (status && status !== project!.statusImpressao) {
      atualizarMutation.mutate(status);
    }
  }

  return (
    <>
      <div className="breadcrumb">
        <Link to="/projetos">Projetos</Link>
        <ChevronRight size={14} />
        <span>{project.titulo}</span>
      </div>

      <div className="project-detail-grid">
        <div className="card project-summary">
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>
            {project.titulo}
          </h1>

          <div className="project-summary__owner">
            <div className="avatar">{iniciais || "—"}</div>
            <div>
              <p className="muted" style={{ fontSize: 12 }}>
                Responsavel
              </p>
              <p style={{ fontWeight: 500 }}>{project.usuario?.nome ?? "—"}</p>
            </div>
          </div>

          <hr className="hr" />

          <p className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
            Descricao do Projeto
          </p>
          <p className="project-summary__description">
            {project.descricao ??
              "Projeto interno em fase de desenvolvimento. Detalhes serao publicados em breve."}
          </p>

          <hr className="hr" />

          {podeEditar && (
            <div className="project-summary__actions">
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (confirm(`Excluir o projeto "${project.titulo}"?`)) {
                    deletarMutation.mutate();
                  }
                }}
                disabled={deletarMutation.isPending}
              >
                <Trash2 size={14} /> {deletarMutation.isPending ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          )}
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
                  <span className={done || active ? "" : "muted"}>{STATUS_LABEL[s]}</span>
                </li>
              );
            })}
          </ul>

          {podeEditar && (
            <div className="field" style={{ marginTop: 18 }}>
              <label htmlFor="status">Alterar Status</label>
              <select
                id="status"
                className="select"
                value={novoStatus || project.statusImpressao}
                onChange={handleAlterarStatus}
                disabled={atualizarMutation.isPending}
              >
                {STATUS_PIPELINE.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              {atualizarMutation.isPending && (
                <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Atualizando...
                </p>
              )}
            </div>
          )}
        </aside>
      </div>

      <section className="card" style={{ marginTop: 18 }}>
        <h3 className="card-title" style={{ marginBottom: 14 }}>
          Arquivos do Projeto
        </h3>
        <div className="project-files">
          {(project.arquivos ?? []).map((f) => (
            <div key={f.id} className="project-file">
              <div className="project-file__icon">
                <Box size={20} />
              </div>
              <div className="project-file__body">
                <div className="project-file__name">{f.nomeArquivo}</div>
                <div className="project-file__meta">
                  <span className="tag">.{f.tipoExtensao}</span>
                </div>
              </div>
              <a
                href={f.urlCaminho}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label="Abrir no Drive"
              >
                <Download size={15} />
              </a>
            </div>
          ))}

          {(project.arquivos ?? []).length === 0 && (
            <p className="muted" style={{ fontSize: 13 }}>
              Nenhum arquivo neste projeto ainda.
            </p>
          )}

          {podeEditar && (
            <button
              className="project-file project-file--add"
              onClick={() => navigate(`/arquivos/${project.id}`)}
            >
              <Plus size={16} />
              Adicionar Arquivo
            </button>
          )}
        </div>
      </section>

      <section className="card" style={{ marginTop: 18, position: "relative" }}>
        <DecoSquare position="top-right" size={70} style={{ opacity: 0.3, top: 16, right: 16 }} />
        <h3 className="card-title" style={{ marginBottom: 16 }}>
          Historico de Alteracoes
        </h3>
        <ul className="history-list">
          {(project.historicos ?? []).map((h) => (
            <li key={h.id} className="history-item">
              <span className="history-item__dot" />
              <div>
                <p style={{ fontSize: 13.5 }}>
                  Status alterado de "{STATUS_LABEL[h.statusAnterior as StatusImpressao] ?? h.statusAnterior}" para "{STATUS_LABEL[h.statusNovo as StatusImpressao] ?? h.statusNovo}"
                </p>
                <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  {new Date(h.dataAlteracao).toLocaleString("pt-BR")}
                </p>
              </div>
            </li>
          ))}

          {(project.historicos ?? []).length === 0 && (
            <p className="muted" style={{ fontSize: 13 }}>
              Nenhuma alteração registrada ainda.
            </p>
          )}
        </ul>
      </section>
    </>
  );
}