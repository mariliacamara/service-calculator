# Calculadora MEI

Projeto Next.js com uma calculadora para estimar quanto cobrar para sobrar um valor líquido desejado.

## Como rodar

```bash
npm install
npm run dev
```

Depois, abra:

```bash
http://localhost:3000/calculadora-mei
```

## Estrutura

- `app/layout.tsx` — metadata e layout base
- `app/calculadora-mei/page.tsx` — rota da calculadora
- `components/MeiCalculator.tsx` — componente client com a lógica
- `app/globals.css` — estilos da interface

## Observação

O cálculo é uma estimativa prática para precificação. Para decisões fiscais, vale confirmar com contabilidade.
