"use client";

import { Check, MapPin } from "lucide-react";
import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import type { Booking, DeliveryMethod } from "./page";
import { radioTabIndex, useRadioGroupKeys } from "@/components/use-radio-group";
import { formatPriceCents } from "@/lib/custom-rug-price";
import {
  DELIVERY_PRICE_CENTS,
  FREE_DELIVERY_HINT,
  formatDeliveryCostCents,
  qualifiesForFreeDelivery,
} from "@/lib/delivery-pricing";
import { isGeowidgetConfigured } from "@/lib/inpost-geowidget";
import { ParcelLockerMapDialog } from "./parcel-locker-map-dialog";
import {
  buildFieldClass,
  FieldError,
  fieldErrorId,
  type FieldErrors,
} from "./field-error";

type AddressField =
  | "deliveryStreet"
  | "deliveryBuildingNumber"
  | "deliveryPostalCode"
  | "deliveryCity";

type DeliveryPickerProps = {
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
  fieldErrors?: FieldErrors;
  // Price of the chosen rug — decides whether delivery is free yet.
  rugPriceCents: number | null;
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
  rugPriceCents,
}: DeliveryPickerProps) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const isFreeDelivery = qualifiesForFreeDelivery(rugPriceCents);

  const selectMethod = (deliveryMethod: DeliveryMethod) => {
    setBooking((previous) => ({
      ...previous,
      deliveryMethod,
      ...(deliveryMethod === "parcel_locker"
        ? null
        : { parcelLockerCode: "", parcelLockerAddress: "" }),
      ...(deliveryMethod === "courier"
        ? null
        : {
            deliveryStreet: "",
            deliveryBuildingNumber: "",
            deliveryPostalCode: "",
            deliveryCity: "",
          }),
    }));
  };

  const handlePointSelected = useCallback(
    (selection: { code: string; address: string }) => {
      setBooking((previous) => ({
        ...previous,
        parcelLockerCode: selection.code,
        parcelLockerAddress: selection.address,
      }));
      setIsMapOpen(false);
    },
    [setBooking],
  );

  const closeMap = useCallback(() => setIsMapOpen(false), []);

  const addressFields: Array<{
    field: AddressField;
    label: string;
    placeholder: string;
    autoComplete: string;
    maxLength: number;
    className: string;
    inputMode?: "numeric";
  }> = [
    {
      field: "deliveryStreet",
      label: "Ulica",
      placeholder: "np. Kwiatowa",
      autoComplete: "address-line1",
      maxLength: 200,
      className: "sm:col-span-2",
    },
    {
      field: "deliveryBuildingNumber",
      label: "Nr domu / lokalu",
      placeholder: "np. 12/3",
      autoComplete: "address-line2",
      maxLength: 20,
      className: "",
    },
    {
      field: "deliveryPostalCode",
      label: "Kod pocztowy",
      placeholder: "np. 31-000",
      autoComplete: "postal-code",
      maxLength: 10,
      className: "",
      inputMode: "numeric",
    },
    {
      field: "deliveryCity",
      label: "Miejscowość",
      placeholder: "np. Kraków",
      autoComplete: "address-level2",
      maxLength: 100,
      className: "sm:col-span-2",
    },
  ];

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
              <span className="block pe-6 text-sm font-black text-[var(--ruggy-ink)]">
                {option.title}
              </span>
              <span className="mt-1 block text-xs font-bold text-[var(--ruggy-body)]">
                {option.description}
              </span>
              <span className="mt-2 flex items-baseline gap-1.5 text-sm font-black text-[var(--ruggy-ink)]">
                {isFreeDelivery ? (
                  <>
                    <s className="text-xs font-bold text-[var(--ruggy-muted)]">
                      {formatPriceCents(DELIVERY_PRICE_CENTS[option.value])}
                    </s>
                    {formatDeliveryCostCents(0)}
                  </>
                ) : (
                  formatPriceCents(DELIVERY_PRICE_CENTS[option.value])
                )}
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

      <p className="text-xs font-bold text-[var(--ruggy-body)]">
        {isFreeDelivery
          ? "Dostawa gratis — Twoje zamówienie przekracza próg darmowej wysyłki."
          : `${FREE_DELIVERY_HINT}.`}
      </p>

      {booking.deliveryMethod === "parcel_locker" ? (
        <div className="space-y-3">
          {isGeowidgetConfigured ? (
            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue-soft)] px-5 text-sm font-black text-[var(--ruggy-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
            >
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              Wybierz paczkomat na mapie
            </button>
          ) : null}

          <label className="block space-y-2">
            <span className={labelClassName}>Kod paczkomatu InPost *</span>
            <input
              value={booking.parcelLockerCode}
              onChange={(event) =>
                setBooking((previous) => ({
                  ...previous,
                  parcelLockerCode: event.target.value,
                  // A hand-typed code no longer matches the address that came
                  // with the point picked on the map.
                  parcelLockerAddress: "",
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

          {booking.parcelLockerAddress ? (
            <p className="text-sm font-bold text-[var(--ruggy-body)]">
              {booking.parcelLockerAddress}
            </p>
          ) : null}

          {isMapOpen ? (
            <ParcelLockerMapDialog
              onSelect={handlePointSelected}
              onClose={closeMap}
            />
          ) : null}
        </div>
      ) : null}

      {booking.deliveryMethod === "courier" ? (
        <fieldset className="space-y-3">
          <legend className={`${labelClassName} mb-2`}>Adres dostawy *</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {addressFields.map((addressField) => (
              <label
                key={addressField.field}
                className={`block space-y-2 ${addressField.className}`}
              >
                <span className={labelClassName}>{addressField.label}</span>
                <input
                  value={booking[addressField.field]}
                  onChange={(event) =>
                    setBooking((previous) => ({
                      ...previous,
                      [addressField.field]: event.target.value,
                    }))
                  }
                  className={buildFieldClass(
                    Boolean(fieldErrors[addressField.field]),
                  )}
                  type="text"
                  name={addressField.field}
                  data-field={addressField.field}
                  autoComplete={addressField.autoComplete}
                  inputMode={addressField.inputMode}
                  placeholder={addressField.placeholder}
                  maxLength={addressField.maxLength}
                  aria-invalid={
                    fieldErrors[addressField.field] ? true : undefined
                  }
                  aria-describedby={
                    fieldErrors[addressField.field]
                      ? fieldErrorId(addressField.field)
                      : undefined
                  }
                  required
                />
                <FieldError
                  id={fieldErrorId(addressField.field)}
                  message={fieldErrors[addressField.field]}
                />
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
    </section>
  );
};
