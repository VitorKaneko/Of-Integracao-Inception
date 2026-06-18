import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle2, Circle } from "lucide-react";
import { solicitacaoService } from "../services/solicitacao.service";
import "./NewRequestPage.css";

const PIPELINE = ["Submetido", "Em Revisao", "Aprovado", "Em Producao", "Concluido"];

export function NewRequestPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    sector: "",
    description: "",
    reference: "",
    name: "",
    email: "",
    phone: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    // Monta a descrição completa com todos os campos do formulário
    const descricaoCompleta = [
      `Projeto: ${form.title}`,
      `Setor: ${form.sector}`,
      ``,
      `Descrição:`,
      form.description,
      form.reference ? `\nReferência: ${form.reference}` : "",
      ``,
      `--- Contato ---`,
      `Nome: ${form.name}`,
      `E-mail: ${form.email}`,
      form.phone ? `Telefone: ${form.phone}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await solicitacaoService.criar(descricaoCompleta);
      navigate("/solicitacoes");
    } catch (err: any) {
      setErro(err.response?.data?.error ?? "Erro ao enviar solicitação.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Link to="/solicitacoes" className="back-link">
        <ArrowLeft size={15} /> Voltar aos Projetos
      </Link>

      <div className="page-header" style={{ marginTop: 8 }}>
        <div>
          <h1>Nova Solicitacao de Projeto</h1>
          <p className="subtitle">Envie uma nova solicitacao de projeto de impressao 3D</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="new-request-grid">
        <div className="card new-request-form">
          <h3 className="card-title section-title">
            <span className="dash" /> Informacoes do Projeto
          </h3>

          <div className="field">
            <label>Nome do Projeto *</label>
            <input
              className="input"
              placeholder="Digite o nome do projeto"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Setor *</label>
            <select
              className="select"
              value={form.sector}
              onChange={(e) => update("sector", e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione o setor
              </option>
              <option>Projetos</option>
              <option>Ensino</option>
              <option>Tesouraria</option>
              <option>Marketing</option>
              <option>RH</option>
            </select>
          </div>

          <div className="field">
            <label>Descricao do Projeto *</label>
            <textarea
              className="textarea"
              placeholder="Descreva os requisitos do projeto, dimensoes, materiais, etc."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              required
              rows={5}
            />
          </div>

          <div className="field">
            <label>Link de Referencia</label>
            <input
              className="input"
              placeholder="https://exemplo.com/referencia"
              value={form.reference}
              onChange={(e) => update("reference", e.target.value)}
            />
          </div>

          <h3 className="card-title section-title" style={{ marginTop: 18 }}>
            <span className="dash dash--red" /> Informacoes de Contato
          </h3>

          <div className="field">
            <label>Nome Completo *</label>
            <input
              className="input"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>E-mail *</label>
            <input
              className="input"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Telefone</label>
            <input
              className="input"
              placeholder="(11) 91234-5678"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          {erro && (
            <p style={{ color: "var(--accent-red)", fontSize: 13, marginTop: 10 }}>
              {erro}
            </p>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              <Send size={14} /> {enviando ? "Enviando..." : "Enviar Solicitacao"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/solicitacoes")}
            >
              Cancelar
            </button>
          </div>
        </div>

        <aside className="card pipeline-card">
          <h3 className="card-title">Pipeline de Aprovacao</h3>
          <ul className="pipeline-list">
            {PIPELINE.map((s, i) => {
              const active = i === 0;
              return (
                <li key={s} className={"pipeline-step" + (active ? " pipeline-step--active" : "")}>
                  {active ? (
                    <CheckCircle2 size={20} color="var(--brand)" />
                  ) : (
                    <Circle size={20} color="var(--border-strong)" />
                  )}
                  <div>
                    <p>{s}</p>
                    {active && (
                      <span className="tag" style={{ marginTop: 4 }}>
                        Atual
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="pipeline-card__note">
            Apos o envio, seu projeto sera revisado por nossa equipe. Voce recebera atualizacoes
            por e-mail conforme ele avanca em cada etapa.
          </div>

          <div className="deco-line" style={{ justifyContent: "center", marginTop: 14 }}>
            <span />
            <span />
          </div>
        </aside>
      </form>
    </>
  );
}