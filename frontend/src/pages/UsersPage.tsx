import { useMemo, useState } from "react";
import { Search, Trash2, Edit3, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuarioService } from "../services/usuario.service";
import { PerfilAcesso } from "../types/api.types";
import { Modal } from "../components/Modal";
import "./UsersPage.css";

function roleClass(perfil: PerfilAcesso) {
  if (perfil === "ADMIN") return "tag tag--red";
  if (perfil === "VISITANTE") return "tag tag--gray";
  return "tag";
}

function getIniciais(nome: string) {
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"Todos" | PerfilAcesso>("Todos");

  // Estado do modal de novo usuário
  const [showNew, setShowNew] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novoPerfil, setNovoPerfil] = useState<PerfilAcesso>("USUARIO");
  const [erroNovo, setErroNovo] = useState<string | null>(null);

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ["usuarios"],
    queryFn: usuarioService.listar,
  });

  const criarMutation = useMutation({
    mutationFn: () =>
      usuarioService.criar({
        nome: novoNome,
        email: novoEmail,
        senha: novaSenha,
        perfilAcesso: novoPerfil,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setShowNew(false);
      setNovoNome("");
      setNovoEmail("");
      setNovaSenha("");
      setNovoPerfil("USUARIO");
      setErroNovo(null);
    },
    onError: (err: any) => {
      setErroNovo(err.response?.data?.error ?? "Erro ao criar usuário.");
    },
  });

  const deletarMutation = useMutation({
    mutationFn: (id: string) => usuarioService.deletar(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });

  const atualizarPerfilMutation = useMutation({
    mutationFn: ({ id, perfilAcesso }: { id: string; perfilAcesso: PerfilAcesso }) =>
      usuarioService.atualizar(id, { perfilAcesso }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });

  const filtered = useMemo(() => {
    return usuarios.filter((u) => {
      const matchSearch =
        search.trim() === "" ||
        u.nome.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = role === "Todos" || u.perfilAcesso === role;
      return matchSearch && matchRole;
    });
  }, [usuarios, search, role]);

  function handleEditarPerfil(id: string, atual: PerfilAcesso) {
    const novo = prompt("Novo perfil (ADMIN, USUARIO, VISITANTE):", atual);
    if (!novo) return;
    const perfilNorm = novo.toUpperCase() as PerfilAcesso;
    if (!["ADMIN", "USUARIO", "VISITANTE"].includes(perfilNorm)) {
      alert("Perfil inválido.");
      return;
    }
    atualizarPerfilMutation.mutate({ id, perfilAcesso: perfilNorm });
  }

  function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    setErroNovo(null);
    if (!novoNome.trim() || !novoEmail.trim() || !novaSenha.trim()) {
      setErroNovo("Preencha todos os campos.");
      return;
    }
    criarMutation.mutate();
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Usuarios do Sistema</h1>
          <p className="subtitle">Gerencie usuarios, permissoes e status da plataforma</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={15} /> Novo Usuario
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="users-filter">
          <div className="search-input" style={{ flex: 1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="select"
            style={{ maxWidth: 170 }}
            value={role}
            onChange={(e) => setRole(e.target.value as PerfilAcesso | "Todos")}
          >
            <option value="Todos">Todos</option>
            <option value="ADMIN">Admin</option>
            <option value="USUARIO">Usuario</option>
            <option value="VISITANTE">Visitante</option>
          </select>
        </div>
      </div>

      <div className="card users-table-wrap">
        <header className="users-table-wrap__header">
          <h2 className="card-title">Lista de Usuarios</h2>
        </header>

        {isLoading && <p className="muted">Carregando usuários...</p>}

        <table className="users-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Data de cadastro</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="avatar">{getIniciais(u.nome)}</div>
                </td>
                <td>{u.nome}</td>
                <td className="muted">{u.email}</td>
                <td>
                  <span className={roleClass(u.perfilAcesso)}>{u.perfilAcesso}</span>
                </td>
                <td className="muted">
                  {new Date(u.dataCadastro).toLocaleDateString("pt-BR")}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="icon-btn"
                      aria-label="Editar perfil"
                      onClick={() => handleEditarPerfil(u.id, u.perfilAcesso)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="icon-btn"
                      aria-label="Excluir"
                      onClick={() => {
                        if (confirm(`Excluir ${u.nome}?`)) deletarMutation.mutate(u.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="users-table-wrap__footer">
          <span className="muted">
            Mostrando {filtered.length} de {usuarios.length} usuarios
          </span>
          <div className="deco-line">
            <span />
            <span />
          </div>
        </footer>
      </div>

      <Modal
        open={showNew}
        onClose={() => setShowNew(false)}
        title="Novo Usuario"
        description="Cadastre um novo usuário na plataforma"
      >
        <form onSubmit={handleCriar} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label>Nome Completo</label>
            <input
              className="input"
              placeholder="Nome do usuário"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              className="input"
              type="email"
              placeholder="email@exemplo.com"
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Senha</label>
            <input
              className="input"
              type="password"
              placeholder="Senha inicial"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Perfil de Acesso</label>
            <select
              className="select"
              value={novoPerfil}
              onChange={(e) => setNovoPerfil(e.target.value as PerfilAcesso)}
            >
              <option value="USUARIO">Usuario</option>
              <option value="ADMIN">Admin</option>
              <option value="VISITANTE">Visitante</option>
            </select>
          </div>

          {erroNovo && (
            <p style={{ color: "var(--accent-red)", fontSize: 13 }}>{erroNovo}</p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowNew(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={criarMutation.isPending}>
              {criarMutation.isPending ? "Criando..." : "Criar Usuario"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}