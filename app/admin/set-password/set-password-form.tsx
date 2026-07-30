"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PageState = "loading" | "ready" | "error";

const getInviteError = (params: URLSearchParams) => {
  const errorCode = params.get("error_code");
  const errorDescription = params.get("error_description");

  if (errorCode === "otp_expired") {
    return "Ten link zaproszenia wygasł albo został już użyty. Poproś właściciela o wysłanie nowego zaproszenia.";
  }

  if (errorDescription) {
    return decodeURIComponent(errorDescription.replace(/\+/g, " "));
  }

  return "Nie udało się aktywować zaproszenia. Poproś właściciela o wysłanie nowego linku.";
};

export default function SetPasswordForm() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [pageError, setPageError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const prepareInviteSession = async () => {
      const params = new URLSearchParams(window.location.hash.slice(1));

      if (params.get("error") || params.get("error_code")) {
        if (isMounted) {
          setPageState("error");
          setPageError(getInviteError(params));
        }
        return;
      }

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          if (isMounted) {
            setPageState("error");
            setPageError(
              "Nie udało się potwierdzić zaproszenia. Poproś o wysłanie nowego linku.",
            );
          }
          return;
        }

        window.history.replaceState(
          null,
          document.title,
          `${window.location.pathname}${window.location.search}`,
        );
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!session) {
        setPageState("error");
        setPageError(
          "Nie znaleziono aktywnego zaproszenia. Otwórz najnowszy link z wiadomości email.",
        );
        return;
      }

      setPageState("ready");
    };

    void prepareInviteSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError("Hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    if (password !== passwordConfirmation) {
      setFormError("Hasła nie są takie same.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await createClient().auth.updateUser({ password });

    if (error) {
      setIsSubmitting(false);
      setFormError("Nie udało się ustawić hasła. Spróbuj ponownie.");
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  };

  const isLoading = pageState === "loading";
  const hasError = pageState === "error";

  return (
    <main
      id="main-content"
      className="ruggy-thread-bg flex min-h-screen items-center justify-center bg-[var(--ruggy-canvas)] px-4 py-10 text-[var(--ruggy-ink)]"
    >
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="ruggy-wordmark text-5xl text-[var(--ruggy-ink)]">
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </p>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">
            Pracownia
          </p>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] shadow-[6px_6px_0_var(--ruggy-border)] md:grid-cols-[0.9fr_1.1fr]">
          <aside className="ruggy-thread-bg flex flex-col justify-between bg-[var(--ruggy-blue)] p-7 text-white sm:p-9">
            <div>
              <p className="mb-6 inline-flex rounded-full bg-[var(--ruggy-yellow)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--ruggy-ink)]">
                Zaproszenie do panelu
              </p>
              <h1 className="max-w-xs text-3xl font-black leading-[0.98] tracking-[-0.04em] sm:text-4xl">
                Witaj w pracowni.
              </h1>
              <p className="mt-5 max-w-sm text-sm font-semibold leading-6 text-white/85">
                Ustaw własne hasło, żeby przejść do zamówień, kalendarza i
                codziennej pracy Ruggy.
              </p>
            </div>
            <p className="mt-10 text-sm font-black text-white/75">
              Twój Wuja Dywaniarz
            </p>
          </aside>

          <section className="p-7 sm:p-9" aria-labelledby="set-password-title">
            <h2
              id="set-password-title"
              className="text-2xl font-black tracking-[-0.04em] text-[var(--ruggy-ink)]"
            >
              Ustaw hasło
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--ruggy-muted)]">
              Hasło będzie używane przy logowaniu do panelu administracyjnego.
            </p>

            {isLoading ? (
              <div
                className="mt-8 rounded-2xl border-2 border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)] p-4 text-sm font-bold text-[var(--ruggy-body)]"
                role="status"
              >
                Sprawdzam zaproszenie...
              </div>
            ) : null}

            {hasError ? (
              <div className="mt-8 rounded-2xl border-2 border-[var(--ruggy-coral)]/50 bg-[#fff0eb] p-4">
                <p className="text-sm font-bold leading-6 text-[var(--ruggy-error)]" role="alert">
                  {pageError}
                </p>
                <Link
                  href="/admin/login"
                  className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--ruggy-blue)] px-5 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--ruggy-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ruggy-blue)]"
                >
                  Wróć do logowania
                </Link>
              </div>
            ) : null}

            {pageState === "ready" ? (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="password"
                    className="text-sm font-black text-[var(--ruggy-body)]"
                  >
                    Nowe hasło
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 8 znaków"
                    className="w-full rounded-xl border-2 border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)] px-3.5 py-3 text-[var(--ruggy-ink)] placeholder:text-[var(--ruggy-muted)] outline-none transition-colors focus:border-[var(--ruggy-blue)] focus:bg-[var(--ruggy-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ruggy-blue)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="password-confirmation"
                    className="text-sm font-black text-[var(--ruggy-body)]"
                  >
                    Powtórz hasło
                  </label>
                  <input
                    id="password-confirmation"
                    name="password-confirmation"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={passwordConfirmation}
                    onChange={(event) =>
                      setPasswordConfirmation(event.target.value)
                    }
                    placeholder="Wpisz hasło jeszcze raz"
                    className="w-full rounded-xl border-2 border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)] px-3.5 py-3 text-[var(--ruggy-ink)] placeholder:text-[var(--ruggy-muted)] outline-none transition-colors focus:border-[var(--ruggy-blue)] focus:bg-[var(--ruggy-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ruggy-blue)]"
                  />
                </div>

                {formError ? (
                  <p
                    className="rounded-xl border-2 border-[var(--ruggy-coral)]/40 bg-[#fff0eb] px-3.5 py-2.5 text-sm font-semibold text-[var(--ruggy-error)]"
                    role="alert"
                  >
                    {formError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 min-h-11 w-full cursor-pointer rounded-full bg-[var(--ruggy-blue)] py-3 text-sm font-black text-white shadow-[4px_4px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--ruggy-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ruggy-blue)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Ustawiam hasło..." : "Aktywuj konto"}
                </button>
              </form>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
