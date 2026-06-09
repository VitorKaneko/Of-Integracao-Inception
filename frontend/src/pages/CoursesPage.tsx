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
import { Course, mockCourses } from "../data/mockData";
import "./CoursesPage.css";

const CATEGORIES = ["Todos", "Modelagem", "Impressao", "Design", "Administrativo"] as const;
const SECTORS = ["Todos os Setores", "Projetos", "Ensino", "Tesouraria", "Marketing", "RH"];

function iconForCategory(category: Course["category"]) {
  if (category === "Modelagem") return <Layers size={42} />;
  if (category === "Impressao") return <Printer size={42} />;
  if (category === "Design") return <Palette size={42} />;
  return <BookOpen size={42} />;
}

function tagVariant(level: Course["level"]) {
  if (level === "Iniciante") return "tag";
  if (level === "Intermediario") return "tag";
  if (level === "Avancado") return "tag tag--red";
  return "tag";
}

export function CoursesPage() {
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORIES)[number]>("Todos");
  const [activeSector, setActiveSector] = useState(SECTORS[0]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockCourses.filter((c) => {
      const matchCat = activeCategory === "Todos" || c.category === activeCategory;
      const matchSearch =
        search.trim() === "" || c.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search, activeSector]);

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

        <div className="filter-pills" style={{ marginBottom: 12 }}>
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

        <div className="filter-pills" style={{ marginBottom: 0 }}>
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
      </div>

      <div className="courses-grid">
        {filtered.map((c) => (
          <article key={c.id} className="course-card card card--hoverable">
            <div className="course-card__thumb">
              <button className="course-card__open" aria-label="Abrir curso">
                <ExternalLink size={14} />
              </button>
              <span className="course-card__badge tag">{c.category}</span>
              <div className="course-card__icon">{iconForCategory(c.category)}</div>
            </div>
            <div className="course-card__body">
              <h3 className="course-card__title">{c.title}</h3>
              <div className="course-card__tags">
                {c.tags.map((t) => (
                  <span key={t} className={tagVariant(c.level)}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="course-card__meta">
                <BookOpen size={14} />
                <span>{c.duration}</span>
              </div>
              <div className="progress" style={{ marginTop: 10 }}>
                <span style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <button className="fab" aria-label="Adicionar curso">
        <Plus size={20} />
      </button>
    </>
  );
}
