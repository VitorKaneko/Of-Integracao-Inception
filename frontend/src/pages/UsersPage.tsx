import { useMemo, useState } from "react";
import { Search, Plus, Download, Edit3, UserPlus, ShieldAlert } from "lucide-react";
import { mockUsers, Role, Sector } from "../data/mockData";
import "./UsersPage.css";

function roleClass(role: Role) {
  if (role === "Super Admin") return "tag tag--purple";
  if (role === "Admin") return "tag tag--red";
  if (role === "Visitante") return "tag tag--gray";
  return "tag";
}

function avatarColor(c?: "teal" | "purple" | "orange" | "pink") {
  if (c === "purple") return "avatar avatar--purple";
  if (c === "orange") return "avatar avatar--orange";
  if (c === "pink") return "avatar avatar--pink";
  return "avatar";
}

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"Todos" | Role>("Todos");
  const [sector, setSector] = useState<"Todos" | Sector>("Todos");

  const filtered = useMemo(() => {
    return mockUsers.filter((u) => {
      const matchSearch =
        search.trim() === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = role === "Todos" || u.role === role;
      const matchSector = sector === "Todos" || u.sector === sector;
      return matchSearch && matchRole && matchSector;
    });
  }, [search, role, sector]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Usuarios do Sistema</h1>
          <p className="subtitle">Gerencie usuarios, permissoes e status da plataforma</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn-primary">
            <Plus size={15} /> Novo Usuario
          </button>
          <span
            className="tag tag--red"
            style={{ paddingInline: 14, paddingBlock: 8, fontSize: 12.5 }}
          >
            <ShieldAlert size={13} /> O Admin
          </span>
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
            onChange={(e) => setRole(e.target.value as Role | "Todos")}
          >
            <option>Todos</option>
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Usuario</option>
            <option>Visitante</option>
          </select>
          <select
            className="select"
            style={{ maxWidth: 170 }}
            value={sector}
            onChange={(e) => setSector(e.target.value as Sector | "Todos")}
          >
            <option>Todos</option>
            <option>Projetos</option>
            <option>Ensino</option>
            <option>Tesouraria</option>
            <option>Marketing</option>
            <option>RH</option>
          </select>
        </div>
      </div>

      <div className="card users-table-wrap">
        <header className="users-table-wrap__header">
          <h2 className="card-title">Lista de Usuarios</h2>
          <button className="btn btn-ghost">
            <Download size={14} /> Exportar
          </button>
        </header>

        <table className="users-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Setor</th>
              <th>Status</th>
              <th>Data de cadastro</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className={avatarColor(u.avatarColor)}>{u.initials}</div>
                </td>
                <td>{u.name}</td>
                <td className="muted">{u.email}</td>
                <td>
                  <span className={roleClass(u.role)}>{u.role}</span>
                </td>
                <td>{u.sector}</td>
                <td>
                  <span
                    className="status-dot"
                    style={{
                      background:
                        u.status === "Ativo"
                          ? "var(--status-success)"
                          : "var(--text-muted)",
                    }}
                  />
                  {u.status}
                </td>
                <td className="muted">{u.createdAt}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="icon-btn" aria-label="Editar">
                      <Edit3 size={14} />
                    </button>
                    <button className="icon-btn" aria-label="Permissoes">
                      <UserPlus size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="users-table-wrap__footer">
          <span className="muted">
            Mostrando {filtered.length} de {mockUsers.length} usuarios
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
