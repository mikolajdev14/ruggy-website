"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const handleLogOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogOut}
      title="Wyloguj się"
      aria-label="Wyloguj się"
      className={
        compact
          ? "flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--ruggy-muted)] transition-colors hover:bg-[var(--ruggy-yellow)] hover:text-[var(--ruggy-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ruggy-blue)]"
          : "inline-flex h-10 items-center justify-center gap-2 rounded-full border-2 border-[var(--ruggy-border)] bg-[var(--ruggy-surface)] px-4 text-sm font-black text-[var(--ruggy-body)] transition-colors hover:border-[var(--ruggy-ink)] hover:bg-[var(--ruggy-yellow)] hover:text-[var(--ruggy-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ruggy-blue)]"
      }
    >
      <LogOut size={16} aria-hidden="true" />
      {compact ? null : <span className="hidden sm:inline">Wyloguj się</span>}
    </button>
  );
}
