"use client";

import React, { useMemo, useState } from "react";

type PresetKey = "servico" | "transporte_passageiros" | "transporte_carga" | "personalizado";

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

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default function MeiCalculator() {
  const [netAmount, setNetAmount] = useState("200");
  const [exemptPercent, setExemptPercent] = useState(32);
  const [taxRate, setTaxRate] = useState(27.5);
  const [preset, setPreset] = useState<PresetKey>("servico");
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const net = Math.max(0, toNumber(netAmount));
    const exempt = Math.min(100, Math.max(0, exemptPercent)) / 100;
    const tax = Math.min(100, Math.max(0, taxRate)) / 100;

    const taxableShare = 1 - exempt;
    const effectiveTax = taxableShare * tax;
    const grossNeeded = effectiveTax >= 1 ? 0 : net / (1 - effectiveTax);
    const exemptValue = grossNeeded * exempt;
    const taxableValue = grossNeeded * taxableShare;
    const taxValue = taxableValue * tax;
    const keptAfterTax = grossNeeded - taxValue;

    return { taxableShare, effectiveTax, grossNeeded, exemptValue, taxableValue, taxValue, keptAfterTax };
  }, [netAmount, exemptPercent, taxRate]);

  function applyPreset(nextPreset: PresetKey) {
    setPreset(nextPreset);
    if (nextPreset !== "personalizado") {
      setExemptPercent(PRESETS[nextPreset].exemptPercent);
      setTaxRate(PRESETS[nextPreset].taxRate);
    }
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(
        `Valor bruto necessário: ${formatBRL(results.grossNeeded)} | Líquido desejado: ${formatBRL(
          Math.max(0, toNumber(netAmount)),
        )}`,
      );
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
            <div className="brand-badge">¥</div>
            <span>Calculadora MEI</span>
          </div>
          <div className="header-pill">Simulação rápida de preço</div>
        </div>
      </div>

      <main className="container">
        <section className="hero">
          <div className="hero-grid">
            <div>
              <div className="kicker">⚡ Ferramenta simples para precificar</div>
              <h1>Descubra quanto cobrar para sobrar o valor que você quer.</h1>
              <p className="hero-copy">
                Ajuste o valor líquido desejado, escolha o tipo de atividade e veja na hora o valor bruto
                necessário. Sem conta manual, sem chute.
              </p>

              <div className="feature-grid">
                <FeatureCard
                  icon="✓"
                  title="Clareza"
                  text="Veja exatamente o que é isento, tributável e quanto sobra no final."
                />
                <FeatureCard
                  icon="↯"
                  title="Rápido"
                  text="Troque os percentuais e teste cenários em segundos."
                />
                <FeatureCard
                  icon="%"
                  title="Prático"
                  text="Use presets prontos para serviço, transporte e personalizado."
                />
              </div>
            </div>

            <section className="card">
              <div className="card-content">
                <div className="result-hero">
                  <div>
                    <p className="result-tagline">Resultado principal</p>
                    <h2 className="result-title">Valor bruto necessário</h2>
                  </div>
                  <div className="result-box">
                    <small>Agora</small>
                    <strong>{formatBRL(results.grossNeeded)}</strong>
                  </div>
                </div>

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
              </div>
            </section>
          </div>
        </section>

        <section className="summary-section">
          <section className="card">
            <div className="card-content">
              <div className="result-hero" style={{ marginBottom: 16 }}>
                <div>
                  <p className="result-tagline">Detalhamento do cálculo</p>
                  <h2 className="result-title">Resumo</h2>
                </div>
              </div>

              <div className="summary-grid">
                <div className="summary-tile dark">
                  <div className="summary-label">Bruto necessário</div>
                  <div className="summary-value">{formatBRL(results.grossNeeded)}</div>
                </div>
                <div className="summary-tile light">
                  <div className="summary-label">Imposto efetivo</div>
                  <div className="summary-value">{formatPercent(results.effectiveTax * 100)}</div>
                </div>
              </div>

              <div className="detail-list" style={{ marginTop: 14 }}>
                <div className="detail-row">
                  <span className="small" style={{ color: "inherit" }}>Parcela isenta</span>
                  <strong>{formatBRL(results.exemptValue)}</strong>
                </div>
                <div className="detail-row">
                  <span className="small" style={{ color: "inherit" }}>Parcela tributável</span>
                  <strong>{formatBRL(results.taxableValue)}</strong>
                </div>
                <div className="detail-row">
                  <span className="small" style={{ color: "inherit" }}>Imposto estimado</span>
                  <strong>{formatBRL(results.taxValue)}</strong>
                </div>
                <div className="detail-row">
                  <span className="small" style={{ color: "inherit" }}>Sobra líquida</span>
                  <strong>{formatBRL(results.keptAfterTax)}</strong>
                </div>
              </div>

              <div className="divider" />

              <div className="callout">
                <strong>Fórmula usada</strong>
                <div>Valor bruto × (1 - parcela isenta) × alíquota = imposto estimado.</div>
                <div style={{ marginTop: 8, color: "#64748b" }}>
                  Essa página serve para estimativa rápida de precificação.
                </div>
              </div>
            </div>
          </section>

          <aside className="sidebar">
            <section className="sidebar-card">
              <h2>Como usar</h2>
              <p>1. Digite quanto você quer receber líquido.</p>
              <p>2. Escolha o tipo de atividade ou ajuste manualmente.</p>
              <p>3. Veja o valor bruto e copie o resultado.</p>
              <div className="divider" />
              <div className="small">
                Se você usa outro percentual de isenção, basta mudar no painel da esquerda.
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
              <strong>⚠ Aviso</strong>
              Os percentuais podem variar conforme atividade, tributação e renda anual.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
