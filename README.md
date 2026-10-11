# Calculadora MEI

Projeto Next.js com uma calculadora para estimar quanto cobrar para sobrar um valor
líquido desejado — ou, no sentido contrário, quanto sobra líquido de um valor que
você vai cobrar.

Publicado em: https://calculadora.camorim.dev.br

## Como rodar

```bash
npm install
npm run dev
```

Depois, abra:

```
http://localhost:3000
```

## Estrutura

- `app/layout.tsx` — metadata, SEO (OpenGraph, JSON-LD) e layout base
- `app/page.tsx` — rota única da calculadora (`/`)
- `app/robots.ts` / `app/sitemap.ts` — SEO técnico
- `components/MeiCalculator.tsx` — componente client com os dois modos de cálculo
  (bruto → líquido e líquido → bruto)
- `app/globals.css` — estilos da interface

## Observação

O cálculo é uma estimativa prática para precificação. Para decisões fiscais, vale
confirmar com contabilidade.
