import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, Plus, ChevronRight, Box, Download, Trash2, Upload } from "lucide-react";
import { mockFiles, mockFolders } from "../data/mockData";
import { Modal } from "../components/Modal";
import { DecoSquare } from "../components/DecoSquare";
import "./FilesPage.css";

export function FolderDetailPage() {
  const { folderId = "" } = useParams();
  const folder = mockFolders.find((f) => f.id === folderId) ?? mockFolders[0];
  const files = mockFiles[folder.id] ?? [];
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Gerenciamento de Arquivos</h1>
          <p className="subtitle">Organize e gerencie seus arquivos 3D</p>
          <div className="breadcrumb" style={{ marginTop: 10 }}>
            <Link to="/arquivos">Arquivos</Link>
            <ChevronRight size={14} />
            <span>{folder.name}</span>
          </div>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
            <Plus size={15} /> Upload de Arquivo
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="search-input">
          <Search size={16} color="var(--text-muted)" />
          <input
            placeholder="Buscar arquivos nesta pasta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <h2 className="h-section" style={{ marginBottom: 14 }}>
        Arquivos em {folder.name}
      </h2>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 42 }}>
          <Box size={36} color="var(--text-muted)" style={{ marginBottom: 10 }} />
          <p className="muted">Nenhum arquivo nesta pasta ainda.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            onClick={() => setShowUpload(true)}
          >
            <Plus size={15} /> Adicionar primeiro arquivo
          </button>
        </div>
      ) : (
        <div className="files-grid">
          {filtered.map((f) => (
            <article key={f.id} className="file-card card">
              <div className="file-card__thumb">
                <Box size={42} color="var(--brand)" />
              </div>
              <div className="file-card__body">
                <div className="file-card__row">
                  <h3 className="file-card__title">{f.name}</h3>
                  <span className="tag">.{f.ext}</span>
                </div>
                <p className="file-card__desc">{f.description}</p>
                <div className="file-card__meta">
                  <span>{f.uploadedAt}</span>
                  <span>{f.size}</span>
                </div>
              </div>
              <div className="file-card__actions">
                <div className="file-card__actions-left">
                  <button className="icon-btn" aria-label="Download">
                    <Download size={15} />
                  </button>
                  <button className="icon-btn" aria-label="Excluir">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="deco-line">
                  <span />
                  <span />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <DecoSquare position="bottom-right" size={92} style={{ bottom: 80, right: 40 }} />

      <Modal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload de Arquivo"
        description="Envie arquivos 3D (.stl, .obj, .3mf, .step, .gcode)"
      >
        <div className="dropzone">
          <Upload size={28} color="var(--brand)" />
          <p style={{ marginTop: 12, fontSize: 14 }}>Arraste um arquivo 3D aqui</p>
          <p className="muted" style={{ fontSize: 12, margin: "8px 0" }}>
            ou
          </p>
          <button className="btn btn-outline" type="button">
            Selecionar Arquivo
          </button>
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={() => setShowUpload(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={() => setShowUpload(false)}>
            Enviar
          </button>
        </div>
      </Modal>
    </>
  );
}
