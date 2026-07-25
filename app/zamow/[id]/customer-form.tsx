"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { Booking } from "./page";
import {
  buildFieldClass,
  FieldError,
  fieldErrorId,
  type FieldErrors,
} from "./field-error";

type CustomerFormProps = {
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
  fieldErrors?: FieldErrors;
};

export const CustomerForm = ({
  booking,
  setBooking,
  fieldErrors = {},
}: CustomerFormProps) => {
  const updateField =
    (field: keyof Booking) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setBooking((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const labelClassName = "text-sm font-black text-[var(--ruggy-ink)]";

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className={labelClassName}>Imię i nazwisko *</span>
          <input
            value={booking.customerName}
            onChange={updateField("customerName")}
            className={buildFieldClass(Boolean(fieldErrors.customerName))}
            type="text"
            name="customerName"
            data-field="customerName"
            autoComplete="name"
            placeholder="Jan Kowalski"
            aria-invalid={fieldErrors.customerName ? true : undefined}
            aria-describedby={
              fieldErrors.customerName
                ? fieldErrorId("customerName")
                : undefined
            }
            required
          />
          <FieldError
            id={fieldErrorId("customerName")}
            message={fieldErrors.customerName}
          />
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>Email *</span>
          <input
            value={booking.customerEmail}
            onChange={updateField("customerEmail")}
            className={buildFieldClass(Boolean(fieldErrors.customerEmail))}
            type="email"
            name="customerEmail"
            data-field="customerEmail"
            autoComplete="email"
            placeholder="jan@example.com"
            aria-invalid={fieldErrors.customerEmail ? true : undefined}
            aria-describedby={
              fieldErrors.customerEmail
                ? fieldErrorId("customerEmail")
                : undefined
            }
            required
          />
          <FieldError
            id={fieldErrorId("customerEmail")}
            message={fieldErrors.customerEmail}
          />
        </label>

        <label className="space-y-2">
          <span className={labelClassName}>Telefon</span>
          <input
            value={booking.customerPhone}
            onChange={updateField("customerPhone")}
            className={buildFieldClass(false)}
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
            className={buildFieldClass(false, true)}
            name="customerNotes"
            placeholder="Kolor, inspiracje, preferowany kontakt lub inne szczegóły"
            maxLength={500}
          />
        </label>
      </div>
    </section>
  );
};
