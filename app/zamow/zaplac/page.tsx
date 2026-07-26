"use client";

import {
  ArrowLeft,
  Check,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { PosterHero } from "@/components/poster-hero";
import { radioTabIndex, useRadioGroupKeys } from "@/components/use-radio-group";
import { type FormEvent, use, useState } from "react";
import { createAgreedProjectCheckout } from "./actions";

const suggestedAmounts = [300, 400, 500, 600, 800, 1000];

const fieldClass =
  "h-12 w-full rounded-xl border-2 border-[var(--ruggy-border-strong)] bg-white px-4 text-base font-bold text-[var(--ruggy-ink)] outline-none transition-colors placeholder:text-[var(--ruggy-muted)] hover:border-[var(--ruggy-ink)] focus:border-[var(--ruggy-blue)] focus:ring-4 focus:ring-[var(--ruggy-blue-soft)]";

const formatAmount = (amount: number | null) =>
  amount == null || !Number.isFinite(amount)
    ? "Nie wybrano"
    : new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
        maximumFractionDigits: 0,
      }).format(amount);

export default function AgreedProjectPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const params = use(searchParams);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [projectReference, setProjectReference] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | undefined>(
    params.cancelled === "1"
      ? "Płatność została anulowana. Możesz poprawić dane i spróbować ponownie."
      : undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedAmount = amount === "" ? null : Number(amount);
  const selectedAmountIndex = suggestedAmounts.findIndex(
    (suggestedAmount) => parsedAmount === suggestedAmount,
  );
  const { containerRef: amountGroupRef, onKeyDown: onAmountKeyDown } =
    useRadioGroupKeys(suggestedAmounts, selectedAmountIndex, (value) =>
      setAmount(String(value)),
    );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage("Przygotowuję bezpieczną płatność...");

    try {
      const result = await createAgreedProjectCheckout({
        customerName,
        customerEmail,
        projectReference,
        amountPln: parsedAmount,
      });

      if (!result.success) {
        setMessage(result.message);
        setIsSubmitting(false);
        return;
      }

      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error("Nie udało się utworzyć płatności:", error);
      setMessage("Nie udało się przygotować płatności. Spróbuj ponownie.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      <header className="border-b border-[var(--ruggy-border)]">
        <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/"
            className="ruggy-wordmark text-4xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
          >
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>
          <Link
            href="/zamow"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold transition-colors hover:bg-[var(--ruggy-blue-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Wróć
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <PosterHero
            icon={CreditCard}
            eyebrow="Uzgodniony projekt"
            words={[
              { text: "Zapłać" },
              { text: "ustaloną" },
              { text: "kwotę", emphasis: true },
              { text: "za" },
              { text: "swój" },
              { text: "dywan." },
            ]}
            description="Ta płatność jest przeznaczona dla projektu, którego szczegóły i cenę ustaliłem już z Tobą wcześniej."
            ribbonWord="dywan"
          />

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-7 rounded-2xl border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-5 shadow-[6px_7px_0_var(--ruggy-ink)] sm:p-7"
          >
            <fieldset>
              <legend className="text-base font-black">Ustalona kwota</legend>
              <div
                ref={amountGroupRef}
                onKeyDown={onAmountKeyDown}
                className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6"
                role="radiogroup"
                aria-label="Sugerowana kwota"
              >
                {suggestedAmounts.map((suggestedAmount, index) => {
                  const isSelected = parsedAmount === suggestedAmount;

                  return (
                    <button
                      key={suggestedAmount}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={radioTabIndex(
                        isSelected,
                        index === 0,
                        selectedAmountIndex !== -1,
                      )}
                      onClick={() => setAmount(String(suggestedAmount))}
                      className={`relative min-h-11 rounded-xl border-2 px-2 text-sm font-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ruggy-blue)] ${
                        isSelected
                          ? "border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)]"
                          : "border-[var(--ruggy-border-strong)] bg-white hover:border-[var(--ruggy-ink)]"
                      }`}
                    >
                      {suggestedAmount} zł
                      {isSelected ? (
                        <Check
                          className="absolute end-1 top-1 size-3"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm font-black">Inna kwota (zł)</span>
                <input
                  type="number"
                  min="50"
                  max="20000"
                  step="1"
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className={fieldClass}
                  placeholder="np. 450"
                  required
                />
              </label>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-black">Imię i nazwisko</span>
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className={fieldClass}
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-black">E-mail</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  className={fieldClass}
                  autoComplete="email"
                  required
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-black">Którego projektu dotyczy płatność?</span>
              <textarea
                value={projectReference}
                onChange={(event) => setProjectReference(event.target.value)}
                className="min-h-28 w-full resize-y rounded-xl border-2 border-[var(--ruggy-border-strong)] bg-white px-4 py-3 text-base font-semibold text-[var(--ruggy-ink)] outline-none transition-colors placeholder:text-[var(--ruggy-muted)] hover:border-[var(--ruggy-ink)] focus:border-[var(--ruggy-blue)] focus:ring-4 focus:ring-[var(--ruggy-blue-soft)]"
                placeholder="np. dywan z logo ustalony na Instagramie"
                maxLength={200}
                required
              />
            </label>

            {message ? (
              <p
                className="rounded-xl bg-[var(--ruggy-blue-soft)] px-4 py-3 text-sm font-bold"
                aria-live="polite"
              >
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ruggy-blue)] px-6 text-sm font-black text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)] disabled:cursor-wait disabled:opacity-65"
            >
              {isSubmitting ? (
                <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <LockKeyhole className="size-5" aria-hidden="true" />
              )}
              {isSubmitting
                ? "Przekierowuję do Stripe..."
                : `Zapłać ${formatAmount(parsedAmount)}`}
            </button>
          </form>
        </div>

        <aside className="rounded-2xl border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-blue-soft)] p-5 lg:sticky lg:top-6">
          <ReceiptText
            className="size-7 text-[var(--ruggy-blue)]"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-lg font-black">Podsumowanie płatności</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--ruggy-border-strong)] pb-4">
              <dt className="text-[var(--ruggy-body)]">Kwota</dt>
              <dd className="text-lg font-black text-[var(--ruggy-blue)]">
                {formatAmount(parsedAmount)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[var(--ruggy-body)]">Operator</dt>
              <dd className="font-black">Stripe</dd>
            </div>
          </dl>
          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--ruggy-body)]">
            <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Dane płatnicze podasz bezpośrednio na zabezpieczonej stronie Stripe.
          </p>
        </aside>
      </section>
    </main>
  );
}
