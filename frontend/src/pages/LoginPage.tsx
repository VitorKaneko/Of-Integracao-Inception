import { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { DecoSquare } from "../components/DecoSquare";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

const DEMO_ACCOUNTS = [
  { id: "u-1", name: "Carlos Henrique Santos", email: "carlos.santos@inception3d.com", password: "carlos123", role: "ADMIN" },
  { id: "u-2", name: "Maria Fernanda Costa",   email: "maria.costa@inception3d.com",  password: "maria123",  role: "ADMIN" },
  { id: "u-3", name: "Roberto Almeida Silva",  email: "roberto.silva@inception3d.com",password: "roberto123",role: "USUARIO" },
  { id: "u-4", name: "Ana Silva",              email: "ana.silva@inception3d.com",    password: "ana123",    role: "USUARIO" },
  { id: "u-5", name: "Pedro Santos Visitante", email: "pedro.visitante@external.com", password: "pedro123", role: "VISITANTE", inactive: true },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  }

  function fillAccount(emailToFill: string, pwd: string) {
    setEmail(emailToFill);
    setPassword(pwd);
    setError(null);
  }

  return (
    <div className="login-page">
      <DecoSquare position="top-left" size={120} />
      <DecoSquare position="bottom-right" size={120} />

      <div className="login-stack">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card__logo">
            <Logo size={72} showLabel={false} />
          </div>
          <h1 className="login-card__title">INCEPTION</h1>
          <p className="login-card__subtitle">Plataforma de Impressao 3D e Modelagem</p>

          <div className="field" style={{ marginTop: 24 }}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: 22 }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="login-accounts">
          <button
            type="button"
            className="login-accounts__toggle"
            onClick={() => setShowAccounts((s) => !s)}
            aria-expanded={showAccounts}
          >
            Contas de demonstracao
            <ChevronDown
              size={14}
              style={{
                transform: showAccounts ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 180ms ease",
              }}
            />
          </button>

          {showAccounts && (
            <ul className="login-accounts__list">
              {DEMO_ACCOUNTS.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    className={"login-account" + (u.inactive ? " login-account--inactive" : "")}
                    onClick={() => fillAccount(u.email, u.password)}
                  >
                    <div className="login-account__top">
                      <span className="login-account__name">{u.name}</span>
                      <span className={"tag tag-role-" + u.role}>{u.role}</span>
                    </div>
                    <div className="login-account__creds">
                      <span>{u.email}</span>
                      <span className="login-account__pwd">{u.password}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}