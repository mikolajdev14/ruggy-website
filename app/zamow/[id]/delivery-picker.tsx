"use client";

import { Check } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Booking, DeliveryMethod } from "./page";
import { radioTabIndex, useRadioGroupKeys } from "@/components/use-radio-group";
import {
  buildFieldClass,
  FieldError,
  fieldErrorId,
  type FieldErrors,
} from "./field-error";

type DeliveryPickerProps = {
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
  fieldErrors?: FieldErrors;
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
  fieldErrors = {},
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

  const labelClassName = "text-sm font-black text-[var(--ruggy-ink)]";
  const methodError = fieldErrors.deliveryMethod;
  const anyChecked = booking.deliveryMethod !== "";
  const selectedIndex = options.findIndex(
    (option) => option.value === booking.deliveryMethod,
  );
  const { containerRef, onKeyDown } = useRadioGroupKeys(
    options.map((option) => option.value),
    selectedIndex,
    (value) => selectMethod(value),
  );

  return (
    <section className="space-y-4">
      <div
        ref={containerRef}
        onKeyDown={onKeyDown}
        className="grid gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Sposób dostawy"
        aria-describedby={
          methodError ? fieldErrorId("deliveryMethod") : undefined
        }
      >
        {options.map((option, index) => {
          const isSelected = booking.deliveryMethod === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={radioTabIndex(isSelected, index === 0, anyChecked)}
              data-field={index === 0 ? "deliveryMethod" : undefined}
              onClick={() => selectMethod(option.value)}
              className={`relative rounded-2xl border-2 p-4 text-start transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)] ${
                isSelected
                  ? "border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] shadow-[3px_4px_0_var(--ruggy-ink)]"
                  : methodError
                    ? "border-[var(--ruggy-error)] bg-[var(--ruggy-surface)] hover:border-[var(--ruggy-error)]"
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
      <FieldError id={fieldErrorId("deliveryMethod")} message={methodError} />

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
            className={buildFieldClass(Boolean(fieldErrors.parcelLockerCode))}
            type="text"
            name="parcelLockerCode"
            data-field="parcelLockerCode"
            autoComplete="off"
            placeholder="np. WAW01A"
            maxLength={100}
            aria-invalid={fieldErrors.parcelLockerCode ? true : undefined}
            aria-describedby={
              fieldErrors.parcelLockerCode
                ? fieldErrorId("parcelLockerCode")
                : undefined
            }
            required
          />
          <FieldError
            id={fieldErrorId("parcelLockerCode")}
            message={fieldErrors.parcelLockerCode}
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
            className={buildFieldClass(Boolean(fieldErrors.deliveryAddress), true)}
            name="deliveryAddress"
            data-field="deliveryAddress"
            autoComplete="street-address"
            placeholder="Ulica i numer, kod pocztowy, miejscowość"
            maxLength={500}
            aria-invalid={fieldErrors.deliveryAddress ? true : undefined}
            aria-describedby={
              fieldErrors.deliveryAddress
                ? fieldErrorId("deliveryAddress")
                : undefined
            }
            required
          />
          <FieldError
            id={fieldErrorId("deliveryAddress")}
            message={fieldErrors.deliveryAddress}
          />
        </label>
      ) : null}
    </section>
  );
};
