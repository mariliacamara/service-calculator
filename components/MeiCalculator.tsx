"use client";

import React, { useMemo, useState } from "react";

type PresetKey = "servico" | "transporte_passageiros" | "transporte_carga" | "personalizado";
type Mode = "net_to_gross" | "gross_to_net";

const PRESETS: Record<
  Exclude<PresetKey, "personalizado">,
  { label: string; exemptPercent: number; taxRate: number }
> = {
  servico: { label: "Serviço (32% isento)", exemptPercent: 32, taxRate: 27.5 },
  transporte_passageiros: {
    label: "Transporte de passageiros (16% isento)",
    exemptPercent: 16,
    taxRate: 27.5,
  },
  transporte_carga: { label: "Transporte de carga (8% isento)", exemptPercent: 8, taxRate: 27.5 },
};

function toNumber(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default function MeiCalculator() {
  const [mode, setMode] = useState<Mode>("net_to_gross");
  const [netAmount, setNetAmount] = useState("200");
  const [grossAmount, setGrossAmount] = useState("400");
  const [exemptPercent, setExemptPercent] = useState(32);
  const [taxRate, setTaxRate] = useState(27.5);
  const [preset, setPreset] = useState<PresetKey>("servico");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const exempt = Math.min(100, Math.max(0, exemptPercent)) / 100;
    const tax = Math.min(100, Math.max(0, taxRate)) / 100;
    const taxableShare = 1 - exempt;
    const effectiveTax = taxableShare * tax;

    let gross: number;
    if (mode === "net_to_gross") {
      const net = Math.max(0, toNumber(netAmount));
      gross = effectiveTax >= 1 ? 0 : net / (1 - effectiveTax);
    } else {
      gross = Math.max(0, toNumber(grossAmount));
    }

    const exemptValue = gross * exempt;
    const taxableValue = gross * taxableShare;
    const taxValue = taxableValue * tax;
    const keptAfterTax = gross - taxValue;

    return { taxableShare, effectiveTax, gross, exemptValue, taxableValue, taxValue, keptAfterTax };
  }, [mode, netAmount, grossAmount, exemptPercent, taxRate]);

  const mainValue = mode === "net_to_gross" ? results.gross : results.keptAfterTax;
  const mainLabel = mode === "net_to_gross" ? "Valor bruto necessário" : "Valor líquido que sobra";

  function applyPreset(nextPreset: PresetKey) {
    setPreset(nextPreset);
    if (nextPreset !== "personalizado") {
      setExemptPercent(PRESETS[nextPreset].exemptPercent);
      setTaxRate(PRESETS[nextPreset].taxRate);
    }
  }

  async function copyResult() {
    try {
      const inputLine =
        mode === "net_to_gross"
          ? `Líquido desejado: ${formatBRL(Math.max(0, toNumber(netAmount)))}`
          : `Valor cobrado: ${formatBRL(Math.max(0, toNumber(grossAmount)))}`;
      await navigator.clipboard.writeText(`${mainLabel}: ${formatBRL(mainValue)} | ${inputLine}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="page">
      <div className="header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-badge">M</div>
            <span>Calculadora MEI</span>
          </div>
          <div className="header-pill">Simulação rápida</div>
        </div>
      </div>

      <main className="container">
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-intro">
              <div className="kicker">Ferramenta de precificação</div>
              <h1>Quanto cobrar para sobrar o valor certo.</h1>
              <p className="hero-copy">
                Escolha se você já sabe o líquido que quer receber ou o valor que vai cobrar, e veja
                o outro lado da conta na hora.
              </p>

              <div className="feature-grid">
                <FeatureCard
                  title="Clareza"
                  text="Veja exatamente o que é isento, tributável e quanto sobra no final."
                />
                <FeatureCard title="Dois sentidos" text="Calcule o bruto a partir do líquido, ou o líquido a partir do bruto." />
                <FeatureCard
                  title="Prático"
                  text="Use presets prontos para serviço, transporte e personalizado."
                />
              </div>
            </div>

            <section className="card">
            <div className="mode-switch" role="tablist" aria-label="Modo de cálculo">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "net_to_gross"}
                className={`mode-btn ${mode === "net_to_gross" ? "active" : ""}`}
                onClick={() => setMode("net_to_gross")}
              >
                Calcular valor bruto
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "gross_to_net"}
                className={`mode-btn ${mode === "gross_to_net" ? "active" : ""}`}
                onClick={() => setMode("gross_to_net")}
              >
                Calcular valor líquido
              </button>
            </div>

            <div className="result-hero">
              <div>
                <p className="result-tagline">{mainLabel}</p>
                <div className="result-value">{formatBRL(mainValue)}</div>
              </div>
              <div className="result-now">agora</div>
            </div>

            {mode === "net_to_gross" ? (
              <div className="field-group">
                <div className="label-row">
                  <label className="label" htmlFor="netAmount">
                    Valor líquido desejado
                  </label>
                </div>
                <input
                  id="netAmount"
                  className="input"
                  inputMode="decimal"
                  value={netAmount}
                  onChange={(e) => setNetAmount(e.target.value)}
                  placeholder="200"
                />
              </div>
            ) : (
              <div className="field-group">
                <div className="label-row">
                  <label className="label" htmlFor="grossAmount">
                    Valor que você vai cobrar
                  </label>
                </div>
                <input
                  id="grossAmount"
                  className="input"
                  inputMode="decimal"
                  value={grossAmount}
                  onChange={(e) => setGrossAmount(e.target.value)}
                  placeholder="400"
                />
              </div>
            )}

            <div className="field-group">
              <div className="label-row">
                <span className="label">Tipo de atividade</span>
              </div>
              <div className="preset-grid">
                {([
                  ["servico", PRESETS.servico.label],
                  ["transporte_passageiros", PRESETS.transporte_passageiros.label],
                  ["transporte_carga", PRESETS.transporte_carga.label],
                  ["personalizado", "Personalizado"],
                ] as Array<[PresetKey, string]>).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    className={`preset-btn ${preset === key ? "active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="slider-panel">
              <div className="label-row">
                <label className="label" htmlFor="exemptPercent">
                  Parcela isenta
                </label>
                <span className="muted-value">{formatPercent(exemptPercent)}</span>
              </div>
              <input
                id="exemptPercent"
                className="range"
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={exemptPercent}
                onChange={(e) => {
                  setPreset("personalizado");
                  setExemptPercent(Number(e.target.value));
                }}
              />
              <div style={{ height: 10 }} />
              <input
                className="input"
                inputMode="decimal"
                value={String(exemptPercent).replace(".", ",")}
                onChange={(e) => {
                  setPreset("personalizado");
                  setExemptPercent(toNumber(e.target.value));
                }}
              />
            </div>

            <div className="slider-panel">
              <div className="label-row">
                <label className="label" htmlFor="taxRate">
                  Alíquota de imposto
                </label>
                <span className="muted-value">{formatPercent(taxRate)}</span>
              </div>
              <input
                id="taxRate"
                className="range"
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={taxRate}
                onChange={(e) => {
                  setPreset("personalizado");
                  setTaxRate(Number(e.target.value));
                }}
              />
              <div style={{ height: 10 }} />
              <input
                className="input"
                inputMode="decimal"
                value={String(taxRate).replace(".", ",")}
                onChange={(e) => {
                  setPreset("personalizado");
                  setTaxRate(toNumber(e.target.value));
                }}
              />
            </div>

            <button onClick={copyResult} className="action-btn" type="button">
              {copied ? "Copiado" : "Copiar resultado"}
            </button>
          </section>
          </div>
        </section>

        <section className="summary-section">
          <section className="card">
            <p className="result-tagline" style={{ marginBottom: 4 }}>
              Detalhamento do cálculo
            </p>
            <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.3rem" }}>
              Resumo
            </h2>

            <div className="summary-grid">
              <div className="summary-tile accent">
                <div className="summary-label">Imposto a guardar</div>
                <div className="summary-value">{formatBRL(results.taxValue)}</div>
              </div>
              <div className="summary-tile outline">
                <div className="summary-label">Imposto efetivo</div>
                <div className="summary-value">{formatPercent(results.effectiveTax * 100)}</div>
              </div>
            </div>

            <div className="detail-list">
              <div className="detail-row">
                <span>Parcela isenta</span>
                <strong>{formatBRL(results.exemptValue)}</strong>
              </div>
              <div className="detail-row">
                <span>Parcela tributável</span>
                <strong>{formatBRL(results.taxableValue)}</strong>
              </div>
              <div className="detail-row">
                <span>Imposto estimado</span>
                <strong>{formatBRL(results.taxValue)}</strong>
              </div>
              <div className="detail-row">
                <span>Sobra líquida</span>
                <strong>{formatBRL(results.keptAfterTax)}</strong>
              </div>
            </div>

            <div className="divider" />

            <div className="callout">
              <strong>Fórmula usada</strong>
              <div>Valor bruto × (1 − parcela isenta) × alíquota = imposto estimado.</div>
            </div>
          </section>

          <aside>
            <section className="sidebar-card">
              <h2>Como usar</h2>
              <p>1. Escolha se quer calcular o bruto ou o líquido.</p>
              <p>2. Digite o valor e escolha o tipo de atividade, ou ajuste manualmente.</p>
              <p>3. Veja o resultado e copie.</p>
              <div className="divider" />
              <div className="small">
                Mudar o slider de isenção ou alíquota troca o tipo de atividade para
                &quot;Personalizado&quot; automaticamente.
              </div>
            </section>
          </aside>
        </section>

        <footer className="footer">
          <div className="footer-grid">
            <div className="small">
              <strong style={{ color: "var(--text)" }}>Observação importante</strong>
              <div>
                Este cálculo é uma estimativa prática e não substitui contabilidade ou orientação fiscal.
              </div>
            </div>
            <div className="warn">
              <strong>Aviso</strong>
              Os percentuais podem variar conforme atividade, tributação e renda anual.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
