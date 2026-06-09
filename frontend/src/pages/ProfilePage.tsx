import { useState } from "react";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import "./ProfilePage.css";

function roleTagClass(role: string) {
  if (role === "Super Admin") return "tag tag--purple";
  if (role === "Admin") return "tag tag--red";
  if (role === "Visitante") return "tag tag--gray";
  return "tag";
}

export function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  if (!user) return null;

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
          <div className={"avatar avatar--lg avatar--" + (user.avatarColor ?? "teal")}>
            {user.initials || <UserIcon size={26} />}
          </div>
          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="muted" style={{ marginTop: 2 }}>
              {user.email}
            </p>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              <span className={roleTagClass(user.role)}>{user.role}</span>
              <span className="tag">{user.sector}</span>
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
            <label>Cargo</label>
            <input className="input" defaultValue={user.role} disabled />
          </div>

          <div className="field">
            <label>Setor</label>
            <input className="input" defaultValue={user.sector} disabled />
          </div>

          <div className="field">
            <label>Membro desde</label>
            <input className="input" defaultValue={user.createdAt} disabled />
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
