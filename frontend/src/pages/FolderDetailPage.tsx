import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, Plus, ChevronRight, Box, Download, Trash2, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projetoService } from "../services/projeto.service";
import { arquivoService } from "../services/arquive.service";
import { useAuth } from "../auth/AuthContext";
import { Modal } from "../components/Modal";
import { DecoSquare } from "../components/DecoSquare";
import "./FilesPage.css";

export function FolderDetailPage() {
  const { folderId = "" } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: projeto, isLoading: loadingProjeto } = useQuery({
    queryKey: ["projeto", folderId],
    queryFn: () => projetoService.buscar(folderId),
    enabled: !!folderId,
  });

  const { data: arquivos = [], isLoading: loadingArquivos } = useQuery({
    queryKey: ["arquivos", folderId],
    queryFn: () => arquivoService.listarPorProjeto(folderId),
    enabled: !!folderId,
  });

  const uploadMutation = useMutation({
    mutationFn: () =>
      arquivoService.upload(folderId, selectedFile!, (pct) => setUploadProgress(pct)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arquivos", folderId] });
      setShowUpload(false);
      setSelectedFile(null);
      setUploadProgress(0);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: (id: string) => arquivoService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arquivos", folderId] });
    },
  });

  const filtered = arquivos.filter((f) =>
    f.nomeArquivo.toLowerCase().includes(search.toLowerCase())
  );

  const podeUpload = user?.perfilAcesso === "ADMIN" || user?.perfilAcesso === "USUARIO";

  if (loadingProjeto) return <p className="muted">Carregando...</p>;
  if (!projeto) return <p className="muted">Pasta não encontrada.</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Gerenciamento de Arquivos</h1>
          <p className="subtitle">Organize e gerencie seus arquivos 3D</p>
          <div className="breadcrumb" style={{ marginTop: 10 }}>
            <Link to="/arquivos">Arquivos</Link>
            <ChevronRight size={14} />
            <span>{projeto.titulo}</span>
          </div>
        </div>
        {podeUpload && (
          <div className="page-header__actions">
            <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
              <Plus size={15} /> Upload de Arquivo
            </button>
          </div>
        )}
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
        Arquivos em {projeto.titulo}
      </h2>

      {loadingArquivos && <p className="muted">Carregando arquivos...</p>}

      {!loadingArquivos && filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 42 }}>
          <Box size={36} color="var(--text-muted)" style={{ marginBottom: 10 }} />
          <p className="muted">Nenhum arquivo nesta pasta ainda.</p>
          {podeUpload && (
            <button
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              onClick={() => setShowUpload(true)}
            >
              <Plus size={15} /> Adicionar primeiro arquivo
            </button>
          )}
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
                  <h3 className="file-card__title">{f.nomeArquivo}</h3>
                  <span className="tag">.{f.tipoExtensao}</span>
                </div>
                <div className="file-card__meta">
                  <span>Projeto: {projeto.titulo}</span>
                </div>
              </div>
              <div className="file-card__actions">
                <div className="file-card__actions-left">
                  
                  <a  href={f.urlCaminho}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    aria-label="Abrir no Drive"
                  >
                    <Download size={15} />
                  </a>
                  {podeUpload && (
                    <button
                      className="icon-btn"
                      aria-label="Excluir"
                      onClick={() => {
                        if (confirm(`Deletar "${f.nomeArquivo}"?`)) {
                          deletarMutation.mutate(f.id);
                        }
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
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
        onClose={() => {
          setShowUpload(false);
          setSelectedFile(null);
          setUploadProgress(0);
        }}
        title="Upload de Arquivo"
        description="Envie arquivos 3D (.stl, .obj, .3mf, .step, .gcode)"
      >
        <div
          className="dropzone"
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: "pointer" }}
        >
          <Upload size={28} color="var(--brand)" />
          {selectedFile ? (
            <p style={{ marginTop: 12, fontSize: 14, color: "var(--brand)" }}>
              {selectedFile.name}
            </p>
          ) : (
            <>
              <p style={{ marginTop: 12, fontSize: 14 }}>Arraste um arquivo 3D aqui</p>
              <p className="muted" style={{ fontSize: 12, margin: "8px 0" }}>ou</p>
              <button className="btn btn-outline" type="button">
                Selecionar Arquivo
              </button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".stl,.obj,.3mf,.step,.gcode,.glb"
            style={{ display: "none" }}
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {uploadMutation.isPending && (
          <div style={{ marginTop: 12 }}>
            <div className="progress">
              <span style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Enviando... {uploadProgress}%
            </p>
          </div>
        )}

        {uploadMutation.isError && (
          <p style={{ color: "var(--accent-red)", fontSize: 13, marginTop: 8 }}>
            Erro ao enviar arquivo. Tente novamente.
          </p>
        )}

        <div className="modal-actions">
          <button
            className="btn btn-outline"
            onClick={() => {
              setShowUpload(false);
              setSelectedFile(null);
            }}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            disabled={!selectedFile || uploadMutation.isPending}
            onClick={() => uploadMutation.mutate()}
          >
            {uploadMutation.isPending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </Modal>
    </>
  );
}