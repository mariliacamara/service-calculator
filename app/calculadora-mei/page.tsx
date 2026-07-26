import type { Metadata } from "next";
import MeiCalculator from "../../components/MeiCalculator";

export const metadata: Metadata = {
  title: "Calculadora MEI | Quanto cobrar para sobrar o valor certo",
  description:
    "Simule quanto cobrar no MEI para atingir um valor líquido desejado considerando parcela isenta, parcela tributável e imposto estimado.",
};

export default function CalculadoraMEIPage() {
  return <MeiCalculator />;
}
