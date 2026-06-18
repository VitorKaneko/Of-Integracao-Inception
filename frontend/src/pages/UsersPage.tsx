import { useMemo, useState } from "react";
import { Search, Trash2, Edit3 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuarioService } from "../services/usuario.service";
import { PerfilAcesso } from "../types/api.types";
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

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ["usuarios"],
    queryFn: usuarioService.listar,
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

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Usuarios do Sistema</h1>
          <p className="subtitle">Gerencie usuarios, permissoes e status da plataforma</p>
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
    </>
  );
}