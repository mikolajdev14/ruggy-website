import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Syne_Mono, Lobster } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const syneMono = Syne_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-syne-mono",
});

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ruggy | Personalizowane dywany",
  description:
    "Ręcznie tuftowane dywany tworzone na podstawie Twojego pomysłu. Zaprojektuj z Ruggy coś naprawdę swojego.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        syneMono.variable,
        lobster.variable,
      )}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
