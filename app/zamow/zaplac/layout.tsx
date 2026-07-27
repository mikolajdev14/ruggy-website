import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zapłać za uzgodniony projekt",
  description:
    "Bezpieczna płatność online za projekt dywanu uzgodniony wcześniej z Ruggy.",
  robots: { index: false, follow: false },
};

export default function AgreedProjectPaymentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
