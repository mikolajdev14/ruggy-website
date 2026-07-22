import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Anulowana płatność",
  robots: { index: false, follow: false, noarchive: true },
};

export default function CancelLayout({ children }: { children: ReactNode }) {
  return children;
}

