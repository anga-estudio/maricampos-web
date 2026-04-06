import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel | Mari Campos",
  robots: { index: false, follow: false },
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
