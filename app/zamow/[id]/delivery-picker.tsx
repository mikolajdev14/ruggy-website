"use client";

import { Check } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Booking, DeliveryMethod } from "./page";

type DeliveryPickerProps = {
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
};

const options: Array<{
  value: DeliveryMethod;
  title: string;
  description: string;
}> = [
  {
    value: "parcel_locker",
    title: "Paczkomat InPost",
    description: "Odbiór w wybranym paczkomacie InPost",
  },
  {
    value: "courier",
    title: "Wysyłka kurierem",
    description: "Dostawa pod wskazany adres",
  },
];

export const DeliveryPicker = ({
  booking,
  setBooking,
}: DeliveryPickerProps) => {
  const selectMethod = (deliveryMethod: DeliveryMethod) => {
    setBooking((previous) => ({
      ...previous,
      deliveryMethod,
      parcelLockerCode:
        deliveryMethod === "parcel_locker" ? previous.parcelLockerCode : "",
      deliveryAddress:
        deliveryMethod === "courier" ? previous.deliveryAddress : "",
    }));
  };

  const inputClassName =
    "h-12 w-full rounded-xl border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] px-4 text-base font-bold text-[var(--ruggy-ink)] outline-none transition-colors placeholder:text-[var(--ruggy-muted)] hover:border-[var(--ruggy-ink)] focus:border-[var(--ruggy-blue)] focus:ring-4 focus:ring-[var(--ruggy-blue-soft)]";
  const labelClassName = "text-sm font-black text-[var(--ruggy-ink)]";

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = booking.deliveryMethod === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectMethod(option.value)}
              className={`relative rounded-2xl border-2 p-4 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)] ${
                isSelected
                  ? "border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] shadow-[3px_4px_0_var(--ruggy-ink)]"
                  : "border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] hover:border-[var(--ruggy-ink)]"
              }`}
            >
              <span className="block text-sm font-black text-[var(--ruggy-ink)]">
                {option.title}
              </span>
              <span className="mt-1 block text-xs font-bold text-[var(--ruggy-body)]">
                {option.description}
              </span>
              {isSelected ? (
                <Check
                  className="absolute end-3 top-3 size-4 text-[var(--ruggy-ink)]"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {booking.deliveryMethod === "parcel_locker" ? (
        <label className="block space-y-2">
          <span className={labelClassName}>Kod paczkomatu InPost *</span>
          <input
            value={booking.parcelLockerCode}
            onChange={(event) =>
              setBooking((previous) => ({
                ...previous,
                parcelLockerCode: event.target.value,
              }))
            }
            className={inputClassName}
            type="text"
            name="parcelLockerCode"
            autoComplete="off"
            placeholder="np. WAW01A"
            maxLength={100}
            required
          />
        </label>
      ) : null}

      {booking.deliveryMethod === "courier" ? (
        <label className="block space-y-2">
          <span className={labelClassName}>Adres dostawy *</span>
          <textarea
            value={booking.deliveryAddress}
            onChange={(event) =>
              setBooking((previous) => ({
                ...previous,
                deliveryAddress: event.target.value,
              }))
            }
            className="min-h-28 w-full resize-y rounded-xl border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] px-4 py-3 text-base font-bold text-[var(--ruggy-ink)] outline-none transition-colors placeholder:text-[var(--ruggy-muted)] hover:border-[var(--ruggy-ink)] focus:border-[var(--ruggy-blue)] focus:ring-4 focus:ring-[var(--ruggy-blue-soft)]"
            name="deliveryAddress"
            autoComplete="street-address"
            placeholder="Ulica i numer, kod pocztowy, miejscowość"
            maxLength={500}
            required
          />
        </label>
      ) : null}
    </section>
  );
};
