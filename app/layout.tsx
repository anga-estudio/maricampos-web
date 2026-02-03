import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mari Campos | Yoga & Bem-estar",
  description: "Mari Campos - Yogi, instrutora de yoga e criadora do Silencie. Transformando vidas através da prática consciente.",
  icons: {
    icon: "/logo-green.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
