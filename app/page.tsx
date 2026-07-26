import type { Metadata } from "next";
import MeiCalculator from "../components/MeiCalculator";

export const metadata: Metadata = {
  title: "Calculadora MEI",
  description: "Calculadora para MEI",
};

export default function HomePage() {
  return <MeiCalculator />;
}