import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Folder, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projetoService } from "../services/projeto.service";
import { useAuth } from "../auth/AuthContext";
import { Modal } from "../components/Modal";
import { DecoSquare } from "../components/DecoSquare";
import "./FilesPage.css";

export function FilesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  const { data: projetos = [], isLoading } = useQuery({
    queryKey: ["projetos"],
    queryFn: projetoService.listar,
  });

  const criarMutation = useMutation({
    mutationFn: () =>
      projetoService.criar({
        titulo: novoTitulo,
        descricao: novaDescricao || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projetos"] });
      setShowNewFolder(false);
      setNovoTitulo("");
      setNovaDescricao("");
    },
  });

  const deletarMutation = useMutation({
    mutationFn: (id: string) => projetoService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projetos"] });
    },
  });

  const folders = useMemo(() => {
    return projetos.filter((p) =>
      p.titulo.toLowerCase().includes(search.toLowerCase())
    );
  }, [projetos, search]);

  const isAdmin = user?.perfilAcesso === "ADMIN";
  const podeCrear = isAdmin || user?.perfilAcesso === "USUARIO";

  function handleDeletar(e: React.MouseEvent, id: string, titulo: string) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Excluir a pasta "${titulo}" e todos os seus arquivos?`)) {
      deletarMutation.mutate(id);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Gerenciamento de Arquivos</h1>
          <p className="subtitle">Organize e gerencie seus arquivos 3D</p>
        </div>
        {podeCrear && (
          <div className="page-header__actions">
            <button className="btn btn-primary" onClick={() => setShowNewFolder(true)}>
              <Plus size={15} /> Nova Pasta
            </button>
          </div>
        )}
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

      {isLoading && <p className="muted">Carregando pastas...</p>}

      <div className="folders-grid">
        {folders.map((p) => {
          const ehAutor = p.idUsuario === user?.id;
          const podeExcluir = isAdmin || ehAutor;

          return (
            <Link
              to={`/arquivos/${p.id}`}
              key={p.id}
              className="folder-card card card--hoverable"
            >
              <div className="folder-card__thumb">
                <Folder size={42} color="var(--brand)" />
              </div>
              <div className="folder-card__body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <h3 className="folder-card__title">{p.titulo}</h3>
                  {podeExcluir && (
                    <button
                      className="icon-btn"
                      aria-label="Excluir pasta"
                      onClick={(e) => handleDeletar(e, p.id, p.titulo)}
                      disabled={deletarMutation.isPending}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <span className="tag" style={{ marginTop: 8 }}>
                  {p.statusImpressao}
                </span>
                <div className="folder-card__meta">
                  <span className="muted">
                    {p.arquivos?.length ?? 0} arquivos
                  </span>
                  <span className="muted">
                    {new Date(p.dataCriacao).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="deco-line" style={{ marginTop: 10 }}>
                  <span />
                  <span />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <DecoSquare position="bottom-right" size={92} style={{ bottom: 32, right: 40 }} />

      <Modal
        open={showNewFolder}
        onClose={() => setShowNewFolder(false)}
        title="Nova Pasta"
        description="Crie uma nova pasta para organizar seus arquivos 3D"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!novoTitulo.trim()) return;
            criarMutation.mutate();
          }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div className="field">
            <label htmlFor="folder-title">Titulo</label>
            <input
              id="folder-title"
              className="input"
              placeholder="Nome da pasta"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="folder-desc">Descricao (opcional)</label>
            <textarea
              id="folder-desc"
              className="textarea"
              placeholder="Adicione uma descricao..."
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
            />
          </div>

          {criarMutation.isError && (
            <p style={{ color: "var(--accent-red)", fontSize: 13 }}>
              Erro ao criar pasta. Tente novamente.
            </p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowNewFolder(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={criarMutation.isPending}
            >
              {criarMutation.isPending ? "Criando..." : "Criar Pasta"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}