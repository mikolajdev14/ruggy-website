import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Konfigurator dywanu",
  description:
    "Skonfiguruj rozmiar, termin i dostawę personalizowanego dywanu Ruggy.",
  robots: { index: false, follow: true },
};

export default function ProductOrderLayout({ children }: { children: ReactNode }) {
  return children;
}

