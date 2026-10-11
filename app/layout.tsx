import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://calculadora.camorim.dev.br";
const TITLE = "Calculadora MEI | Quanto cobrar para sobrar o valor certo";
const DESCRIPTION =
  "Calcule em segundos o valor bruto que você precisa cobrar para sobrar um líquido desejado, ou o líquido que sobra de um valor que você vai cobrar — considerando parcela isenta, parcela tributável e imposto estimado do MEI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Calculadora MEI",
  },
  description: DESCRIPTION,
  keywords: [
    "calculadora mei",
    "quanto cobrar mei",
    "precificação mei",
    "imposto de renda mei",
    "parcela isenta mei",
    "valor bruto líquido",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Calculadora MEI",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora MEI",
  url: SITE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description: DESCRIPTION,
  inLanguage: "pt-BR",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
