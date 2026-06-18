import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Calendar, User, Activity } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projetoService } from "../services/projeto.service";
import { useAuth } from "../auth/AuthContext";
import { StatusImpressao } from "../types/api.types";
import { Modal } from "../components/Modal";
import "./ProjectsPage.css";

const STATUS_FILTERS: ("Todos" | StatusImpressao)[] = [
  "Todos",
  "PENDENTE",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "CANCELADO",
];

const STATUS_LABEL: Record<string, string> = {
  Todos: "Todos",
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluido",
  CANCELADO: "Cancelado",
};

function statusTagClass(status: StatusImpressao) {
  if (status === "EM_ANDAMENTO") return "tag--solid-warning";
  if (status === "CONCLUIDO") return "tag--solid-success";
  if (status === "CANCELADO") return "tag--solid-danger";
  return "";
}

export function ProjectsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState<"Todos" | StatusImpressao>("Todos");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const { data: projetos = [], isLoading } = useQuery({
    queryKey: ["projetos"],
    queryFn: projetoService.listar,
  });

  const criarMutation = useMutation({
    mutationFn: () =>
      projetoService.criar({ titulo, descricao: descricao || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projetos"] });
      setShowNew(false);
      setTitulo("");
      setDescricao("");
    },
  });

  const filtered = useMemo(() => {
    return projetos.filter((p) => {
      const matchStatus = activeStatus === "Todos" || p.statusImpressao === activeStatus;
      const matchSearch =
        search.trim() === "" ||
        p.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (p.usuario?.nome ?? "").toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [projetos, activeStatus, search]);

  const podeCrear = user?.perfilAcesso === "ADMIN" || user?.perfilAcesso === "USUARIO";

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Gestao de Projetos</h1>
          <p className="subtitle">Gerencie e acompanhe todos os seus projetos de impressao 3D</p>
        </div>
        {podeCrear && (
          <div className="page-header__actions">
            <button className="btn btn-primary" onClick={() => setShowNew(true)}>
              <Plus size={16} /> Novo Projeto
            </button>
          </div>
        )}
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
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            className={"pill" + (activeStatus === s ? " pill--active" : "")}
            onClick={() => setActiveStatus(s)}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {isLoading && <p className="muted">Carregando projetos...</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="muted" style={{ fontSize: 13 }}>
          Nenhum projeto encontrado.
        </p>
      )}

      <div className="projects-grid">
        {filtered.map((p) => (
          <Link to={`/projetos/${p.id}`} key={p.id} className="project-card card card--hoverable">
            <div className="project-card__header">
              <h3 className="project-card__title">{p.titulo}</h3>
              <span className={"tag " + statusTagClass(p.statusImpressao)}>
                {STATUS_LABEL[p.statusImpressao]}
              </span>
            </div>
            <ul className="project-card__meta">
              <li>
                <User size={13} /> {p.usuario?.nome ?? "—"}
              </li>
              <li>
                <Activity size={13} /> {p.visibilidade === "PUBLICO" ? "Público" : "Privado"}
              </li>
              <li>
                <Calendar size={13} /> Criado em{" "}
                {new Date(p.dataCriacao).toLocaleDateString("pt-BR")}
              </li>
            </ul>
          </Link>
        ))}
      </div>

      <Modal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Novo Projeto"
        description="Crie um novo projeto de impressão 3D"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!titulo.trim()) return;
            criarMutation.mutate();
          }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="field">
            <label>Título</label>
            <input
              className="input"
              placeholder="Nome do projeto"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Descrição (opcional)</label>
            <textarea
              className="textarea"
              placeholder="Descreva o projeto..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {criarMutation.isError && (
            <p style={{ color: "var(--accent-red)", fontSize: 13 }}>
              Erro ao criar projeto. Tente novamente.
            </p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowNew(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={criarMutation.isPending}>
              {criarMutation.isPending ? "Criando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}