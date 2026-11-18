import type { Metadata } from "next";
import { Cormorant_Garamond, Libre_Baskerville, Raleway } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({\n  variable: "--font-display",\n  subsets: ["latin"],\n  weight: ["300", "400", "500"],\n  style: ["normal", "italic"],\n  display: "swap",\n});\n\nconst libre = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LP Jóias | Elegância em cada detalhe",
  description:
    "Descubra a coleção LP Jóias: pulseiras, pingentes, colares, anéis e peças selecionadas em prata.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${libre.variable} ${raleway.variable}`}>{children}</body>
    </html>
  );
}
