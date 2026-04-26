import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Folder } from "lucide-react";
import { mockFolders } from "../data/mockData";
import { Modal } from "../components/Modal";
import { DecoSquare } from "../components/DecoSquare";
import "./FilesPage.css";

export function FilesPage() {
  const [search, setSearch] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  const folders = useMemo(() => {
    return mockFolders.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Gerenciamento de Arquivos</h1>
          <p className="subtitle">Organize e gerencie seus arquivos 3D</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={() => setShowNewFolder(true)}>
            <Plus size={15} /> Nova Pasta
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="search-input">
          <Search size={16} color="var(--text-muted)" />
          <input
            placeholder="Buscar pastas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <h2 className="h-section" style={{ marginBottom: 14 }}>
        Pastas
      </h2>

      <div className="folders-grid">
        {folders.map((f) => (
          <Link to={`/arquivos/${f.id}`} key={f.id} className="folder-card card card--hoverable">
            <div className="folder-card__thumb">
              <Folder size={42} color="var(--brand)" />
            </div>
            <div className="folder-card__body">
              <h3 className="folder-card__title">{f.name}</h3>
              <span className="tag" style={{ marginTop: 8 }}>
                {f.category}
              </span>
              <div className="folder-card__meta">
                <span className="muted">{f.count} arquivos</span>
                <span className="muted">{f.updatedAt}</span>
              </div>
              <div className="deco-line" style={{ marginTop: 10 }}>
                <span />
                <span />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <DecoSquare position="bottom-right" size={92} style={{ bottom: 32, right: 40 }} />

      <Modal
        open={showNewFolder}
        onClose={() => setShowNewFolder(false)}
        title="Nova Pasta"
        description="Crie uma nova pasta para organizar seus arquivos"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowNewFolder(false);
          }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="field">
            <label htmlFor="folder-title">Titulo</label>
            <input id="folder-title" className="input" placeholder="Nome da pasta" />
          </div>
          <div className="field">
            <label htmlFor="folder-category">Categoria</label>
            <select id="folder-category" className="select" defaultValue="">
              <option value="" disabled>
                Selecione uma categoria
              </option>
              <option>Projetos</option>
              <option>Ensino</option>
              <option>Tesouraria</option>
              <option>Marketing</option>
              <option>RH</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="folder-desc">Descricao (opcional)</label>
            <textarea
              id="folder-desc"
              className="textarea"
              placeholder="Adicione uma descricao..."
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowNewFolder(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Criar Pasta
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
