import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  FolderKanban,
  FileText,
  GraduationCap,
  ClipboardList,
  User as UserIcon,
  Users,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "../auth/AuthContext";
import { PerfilAcesso } from "../types/api.types";
import "./Sidebar.css";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  end?: boolean;
  roles?: PerfilAcesso[];
}

const items: NavItem[] = [
  { to: "/", label: "Painel", icon: LayoutGrid, end: true },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/arquivos", label: "Arquivos", icon: FileText },
  { to: "/cursos", label: "Cursos", icon: GraduationCap },
  { to: "/solicitacoes", label: "Solicitacoes", icon: ClipboardList },
  { to: "/perfil", label: "Perfil", icon: UserIcon },
  { to: "/usuarios", label: "Usuarios", icon: Users, roles: ["ADMIN"] },
];

function getIniciais(nome: string) {
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const visibleItems = items.filter(
    (i) => !i.roles || (user && i.roles.includes(user.perfilAcesso))
  );

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <Logo size={120} showLabel={false} />
      </div>

      {user && (
        <div className="sidebar__user">
          <div className="avatar avatar--teal">{getIniciais(user.nome)}</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name" title={user.nome}>
              {user.nome}
            </span>
            <span className="sidebar__user-role">{user.perfilAcesso}</span>
          </div>
        </div>
      )}

      <nav className="sidebar__nav">
        {visibleItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              "sidebar__link" + (isActive ? " sidebar__link--active" : "")
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar__logout" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Sair</span>
      </button>
    </aside>
  );
}