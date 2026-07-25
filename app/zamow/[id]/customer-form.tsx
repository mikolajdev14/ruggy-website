"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { Booking } from "./page";

type CustomerFormProps = {
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
};

export const CustomerForm = ({ booking, setBooking }: CustomerFormProps) => {
  const updateField =
    (field: keyof Booking) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBooking((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const inputClassName =
    "h-12 w-full rounded-xl border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] px-4 text-base font-bold text-[var(--ruggy-ink)] outline-none transition-colors placeholder:text-[var(--ruggy-muted)] hover:border-[var(--ruggy-ink)] focus:border-[var(--ruggy-blue)] focus:ring-4 focus:ring-[var(--ruggy-blue-soft)]";
  const labelClassName = "text-sm font-black text-[var(--ruggy-ink)]";

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className={labelClassName}>Imię i nazwisko *</span>
          <input
            value={booking.customerName}
            onChange={updateField("customerName")}
            className={inputClassName}
            type="text"
            name="customerName"
            autoComplete="name"
            placeholder="Jan Kowalski"
            required
          />
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>Email *</span>
          <input
            value={booking.customerEmail}
            onChange={updateField("customerEmail")}
            className={inputClassName}
            type="email"
            name="customerEmail"
            autoComplete="email"
            placeholder="jan@example.com"
            required
          />
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>Telefon</span>
          <input
            value={booking.customerPhone}
            onChange={updateField("customerPhone")}
            className={inputClassName}
            type="tel"
            name="customerPhone"
            autoComplete="tel"
            placeholder="+48 000 000 000"
          />
        </label>

        <label className="space-y-2 md:col-span-3">
          <span className={labelClassName}>Uwagi do zamówienia</span>
          <textarea
            value={booking.customerNotes}
            onChange={updateField("customerNotes")}
            className="min-h-28 w-full resize-y rounded-xl border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] px-4 py-3 text-base font-bold text-[var(--ruggy-ink)] outline-none transition-colors placeholder:text-[var(--ruggy-muted)] hover:border-[var(--ruggy-ink)] focus:border-[var(--ruggy-blue)] focus:ring-4 focus:ring-[var(--ruggy-blue-soft)]"
            name="customerNotes"
            placeholder="Kolor, inspiracje, preferowany kontakt lub inne szczegóły"
            maxLength={500}
          />
        </label>
      </div>
    </section>
  );
};
