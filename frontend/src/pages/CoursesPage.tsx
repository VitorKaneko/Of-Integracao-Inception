import { useMemo, useState } from "react";
import {
  Search,
  ExternalLink,
  Layers,
  Printer,
  Palette,
  BookOpen,
  Plus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { conteudoService } from "../services/conteudo.service";
import { ConteudoEducacional } from "../types/api.types";
import "./CoursesPage.css";

const CATEGORIES = ["Todos", "Modelagem", "Impressao", "Design", "Administrativo"] as const;

function iconForCategory(category: string) {
  if (category === "Modelagem") return <Layers size={42} />;
  if (category === "Impressao") return <Printer size={42} />;
  if (category === "Design") return <Palette size={42} />;
  return <BookOpen size={42} />;
}

export function CoursesPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORIES)[number]>("Todos");
  const [search, setSearch] = useState("");
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("Modelagem");
  const [novoLink, setNovoLink] = useState("");
  const [salvando, setSalvando] = useState(false);

  const { data: conteudos = [], isLoading, refetch } = useQuery({
    queryKey: ["conteudos"],
    queryFn: conteudoService.listar,
  });

  const filtered = useMemo(() => {
    return conteudos.filter((c) => {
      const matchCat = activeCategory === "Todos" || c.categoria === activeCategory;
      const matchSearch =
        search.trim() === "" ||
        c.titulo.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [conteudos, activeCategory, search]);

  const isAdmin = user?.perfilAcesso === "ADMIN";

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!novoTitulo.trim() || !novoLink.trim()) return;
    setSalvando(true);
    try {
      await conteudoService.criar({
        titulo: novoTitulo,
        categoria: novaCategoria,
        urlLink: novoLink,
      });
      await refetch();
      setShowNewCourse(false);
      setNovoTitulo("");
      setNovoLink("");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Cursos e Materiais</h1>
          <p className="subtitle">Expanda suas habilidades com nossos recursos de aprendizado</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="search-input" style={{ marginBottom: 14 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills" style={{ marginBottom: 0 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={"pill" + (activeCategory === c ? " pill--active" : "")}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="muted">Carregando conteúdos...</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="muted" style={{ fontSize: 13 }}>
          Nenhum conteúdo encontrado.
        </p>
      )}

      <div className="courses-grid">
        {filtered.map((c) => (
          <CourseCard key={c.id} conteudo={c} isAdmin={isAdmin} onDeleted={refetch} />
        ))}
      </div>

      {isAdmin && (
        <>
          <button
            className="fab"
            aria-label="Adicionar curso"
            onClick={() => setShowNewCourse(true)}
          >
            <Plus size={20} />
          </button>

          {showNewCourse && (
            <div className="modal-overlay" onClick={() => setShowNewCourse(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="card-title" style={{ marginBottom: 16 }}>Novo Conteúdo</h2>
                <form onSubmit={handleCriar} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="field">
                    <label>Título</label>
                    <input
                      className="input"
                      placeholder="Título do curso ou material"
                      value={novoTitulo}
                      onChange={(e) => setNovoTitulo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Categoria</label>
                    <select
                      className="select"
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                    >
                      {CATEGORIES.filter((c) => c !== "Todos").map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Link</label>
                    <input
                      className="input"
                      placeholder="https://..."
                      value={novoLink}
                      onChange={(e) => setNovoLink(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowNewCourse(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={salvando}
                    >
                      {salvando ? "Salvando..." : "Criar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

interface CourseCardProps {
  conteudo: ConteudoEducacional;
  isAdmin: boolean;
  onDeleted: () => void;
}

function CourseCard({ conteudo, isAdmin, onDeleted }: CourseCardProps) {
  async function handleDelete() {
    if (!confirm(`Deletar "${conteudo.titulo}"?`)) return;
    await conteudoService.deletar(conteudo.id);
    onDeleted();
  }

  return (
    <article className="course-card card card--hoverable">
      <div className="course-card__thumb">
        
        <a href={conteudo.urlLink}
          target="_blank"
          rel="noopener noreferrer"
          className="course-card__open"
          aria-label="Abrir curso"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={14} />
        </a>
        <span className="course-card__badge tag">{conteudo.categoria}</span>
        <div className="course-card__icon">
          {iconForCategory(conteudo.categoria)}
        </div>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{conteudo.titulo}</h3>
        <div className="course-card__meta">
          <BookOpen size={14} />
          <span>{conteudo.usuarioAdmin?.nome ?? "—"}</span>
        </div>
        {isAdmin && (
          <button
            className="btn btn-outline"
            style={{ marginTop: 10, fontSize: 12 }}
            onClick={handleDelete}
          >
            Remover
          </button>
        )}
      </div>
    </article>
  );
}