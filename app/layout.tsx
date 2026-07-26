import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculadora MEI | Quanto cobrar para sobrar o valor certo",
  description:
    "Simule quanto cobrar no MEI para atingir um valor líquido desejado considerando parcela isenta, parcela tributável e imposto estimado.",
  alternates: {
    canonical: "/calculadora-mei",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
