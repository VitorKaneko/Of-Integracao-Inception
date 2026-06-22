import { useState } from "react";
import { User as UserIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { usuarioService } from "../services/usuario.service";
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
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: "ok" | "erro"; msg: string } | null>(null);

  const salvarMutation = useMutation({
    mutationFn: () =>
      usuarioService.atualizarPerfil({
        nome: name,
        email,
        senha: senha.trim() ? senha : undefined,
      }),
    onSuccess: async () => {
      setFeedback({ tipo: "ok", msg: "Perfil atualizado com sucesso!" });
      setSenha("");
      setMostrarSenha(false);
      if (refreshUser) await refreshUser();
    },
    onError: (err: any) => {
      setFeedback({
        tipo: "erro",
        msg: err.response?.data?.error ?? "Erro ao atualizar perfil.",
      });
    },
  });

  if (!user) return null;

  const iniciais = getIniciais(user.nome);
  const membroDesde = user.dataCadastro
    ? new Date(user.dataCadastro).toLocaleDateString("pt-BR")
    : "—";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    salvarMutation.mutate();
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Perfil</h1>
          <p className="subtitle">Gerencie suas informacoes</p>
        </div>
      </div>

      <form className="card profile-card" onSubmit={handleSubmit}>
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
            <button
              type="button"
              className="link-btn"
              onClick={() => setMostrarSenha((s) => !s)}
            >
              {mostrarSenha ? "Cancelar" : "Alterar senha"}
            </button>
          </div>
          {mostrarSenha && (
            <input
              type="password"
              className="input"
              style={{ marginTop: 8 }}
              placeholder="Nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          )}
        </div>

        {feedback && (
          <p
            style={{
              fontSize: 13,
              marginTop: 12,
              color: feedback.tipo === "ok" ? "var(--brand)" : "var(--accent-red)",
            }}
          >
            {feedback.msg}
          </p>
        )}

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={salvarMutation.isPending}
        >
          {salvarMutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </>
  );
}