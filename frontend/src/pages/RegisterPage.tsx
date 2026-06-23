import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";
import { DecoSquare } from "../components/DecoSquare";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await register(nome, email, senha, telefone || undefined);
    setLoading(false);
    if (result.ok) {
      navigate("/", { replace: true });
    } else {
      setError(result.error);
    }
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
          <h1 className="login-card__title">CRIAR CONTA</h1>
          <p className="login-card__subtitle">Cadastre-se na plataforma Inception 3D</p>

          <div className="field" style={{ marginTop: 24 }}>
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              type="text"
              className="input"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
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
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="tel"
              className="input"
              placeholder="(11) 91234-5678"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="input"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="new-password"
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
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>

          <Link
            to="/login"
            className="link-btn"
            style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center" }}
          >
            <ArrowLeft size={14} /> Já tenho conta
          </Link>
        </form>
      </div>
    </div>
  );
}