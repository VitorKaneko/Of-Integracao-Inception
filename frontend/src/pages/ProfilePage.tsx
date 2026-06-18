import { useState } from "react";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import "./ProfilePage.css";

function roleTagClass(perfil: string) {
  if (perfil === "ADMIN") return "tag tag--red";
  if (perfil === "VISITANTE") return "tag tag--gray";
  return "tag";
}

function getIniciais(nome: string) {
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  if (!user) return null;

  const iniciais = getIniciais(user.nome);
  const membroDesde = user.dataCadastro
    ? new Date(user.dataCadastro).toLocaleDateString("pt-BR")
    : "—";

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Perfil</h1>
          <p className="subtitle">Gerencie suas informacoes</p>
        </div>
      </div>

      <form className="card profile-card" onSubmit={(e) => e.preventDefault()}>
        <header className="profile-card__header">
          <div className="avatar avatar--lg avatar--teal">
            {iniciais || <UserIcon size={26} />}
          </div>
          <div>
            <h2 className="profile-name">{user.nome}</h2>
            <p className="muted" style={{ marginTop: 2 }}>
              {user.email}
            </p>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              <span className={roleTagClass(user.perfilAcesso)}>{user.perfilAcesso}</span>
            </div>
          </div>
        </header>

        <div className="profile-grid">
          <div className="field">
            <label>Nome Completo</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field" style={{ gridColumn: "span 2" }}>
            <label>E-mail</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field">
            <label>Perfil de Acesso</label>
            <input className="input" defaultValue={user.perfilAcesso} disabled />
          </div>

          <div className="field">
            <label>Membro desde</label>
            <input className="input" defaultValue={membroDesde} disabled />
          </div>
        </div>

        <div className="profile-password">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Senha</label>
            <button type="button" className="link-btn">
              Alterar senha
            </button>
          </div>
        </div>

        <button className="btn btn-primary btn-block" type="submit">
          Salvar
        </button>
      </form>
    </>
  );
}