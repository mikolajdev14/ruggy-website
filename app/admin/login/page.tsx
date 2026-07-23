"use client";

import { use, useActionState } from "react";
import { handleLogin } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = use(searchParams);
  const requestedDestination = Array.isArray(params.next)
    ? params.next[0]
    : params.next;
  const destination =
    requestedDestination?.startsWith("/admin/") &&
    !requestedDestination.startsWith("//")
      ? requestedDestination
      : "/admin/dashboard";
  const [data, formAction, isPending] = useActionState(handleLogin, undefined);

  return (
    <main className="ruggy-thread-bg flex min-h-screen items-center justify-center bg-[var(--ruggy-canvas)] px-4 py-10 text-[var(--ruggy-ink)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="ruggy-wordmark text-5xl text-[var(--ruggy-ink)]">
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </p>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">
            Pracownia
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[var(--ruggy-ink)]">
            Panel admina
          </h1>
        </div>

        <div className="rounded-[2rem] border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-7 shadow-[6px_6px_0_var(--ruggy-border)] sm:p-8">
          <form action={formAction} className="flex flex-col gap-5">
            <input type="hidden" name="next" value={destination} />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-black text-[var(--ruggy-body)]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@pracownia.pl"
                className="w-full rounded-xl border-2 border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)] px-3.5 py-3 text-[var(--ruggy-ink)] placeholder:text-[var(--ruggy-muted)] outline-none transition-colors focus:border-[var(--ruggy-blue)] focus:bg-[var(--ruggy-surface)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-black text-[var(--ruggy-body)]"
              >
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full rounded-xl border-2 border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)] px-3.5 py-3 text-[var(--ruggy-ink)] placeholder:text-[var(--ruggy-muted)] outline-none transition-colors focus:border-[var(--ruggy-blue)] focus:bg-[var(--ruggy-surface)]"
              />
            </div>

            {data?.error && (
              <p className="rounded-xl border-2 border-[var(--ruggy-coral)]/40 bg-[#fff0eb] px-3.5 py-2.5 text-sm font-semibold text-[var(--ruggy-error)]">
                {data.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-1 w-full cursor-pointer rounded-full bg-[var(--ruggy-blue)] py-3 text-sm font-black text-white shadow-[4px_4px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--ruggy-ink)] disabled:opacity-50"
            >
              {isPending ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
