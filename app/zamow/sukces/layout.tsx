import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Potwierdzenie zamówienia",
  robots: { index: false, follow: false, noarchive: true },
};

export default function SuccessLayout({ children }: { children: ReactNode }) {
  return children;
}

