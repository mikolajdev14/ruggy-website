"use client";
import { getMinimumBookingDateKey } from "@/lib/booking-date";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Booking } from "./page";
import type { Dispatch, SetStateAction } from "react";
import { FieldError, fieldErrorId, type FieldErrors } from "./field-error";

type DatePickerProps = {
  setBooking: Dispatch<SetStateAction<Booking>>;
  blockedDates: Date[];
  fieldErrors?: FieldErrors;
};

const css = `
  .order-calendar {
    --rdp-accent-color: var(--ruggy-blue);
    --rdp-today-color: var(--ruggy-blue);
    margin: 0;
  }

  .order-calendar .rdp-months {
    max-width: 100%;
  }

  .order-calendar .rdp-month {
    width: 100%;
  }

  .order-calendar .rdp-month_grid {
    width: 100%;
  }

  .order-calendar .rdp-caption_label {
    font-size: 0.95rem;
    font-weight: 650;
  }

  .order-calendar .rdp-weekday {
    color: var(--ruggy-muted);
    font-size: 0.75rem;
    font-weight: 600;
  }

  .order-calendar .rdp-day_button {
    border-radius: 0.375rem;
  }

  .order-calendar .rdp-selected .rdp-day_button {
    background: var(--ruggy-blue);
    border-color: var(--ruggy-blue);
    color: white;
  }

  .order-calendar .my-disabled .rdp-day_button,
  .order-calendar .rdp-disabled .rdp-day_button {
    color: var(--ruggy-border-strong);
    text-decoration: line-through;
  }
`;

export const DatePicker = ({
  setBooking,
  blockedDates,
  fieldErrors = {},
}: DatePickerProps) => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [minimumBookingDate] = useState(() => {
    const [year, month, day] = getMinimumBookingDateKey().split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  useEffect(() => {
    setBooking((prev) => ({ ...prev, pickupDate: selected ?? null }));
  }, [selected, setBooking]);

  return (
    <section className="space-y-5" aria-labelledby="date-picker-title">
      <style>{css}</style>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--ruggy-blue-soft)] text-[var(--ruggy-blue)]">
          <CalendarDays className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h3
            id="date-picker-title"
            className="text-lg font-black text-[var(--ruggy-ink)]"
          >
            Termin realizacji
          </h3>
          <p className="mt-1 max-w-md text-sm leading-6 text-[var(--ruggy-body)]">
            To dzień, w którym zaczynam pracę nad Twoim dywanem. Zajęte oraz
            zbyt bliskie terminy są wyszarzone i przekreślone.
          </p>
        </div>
      </div>

      <div
        data-field="pickupDate"
        tabIndex={-1}
        aria-invalid={fieldErrors.pickupDate ? true : undefined}
        aria-describedby={
          fieldErrors.pickupDate ? fieldErrorId("pickupDate") : undefined
        }
        className={`rounded-2xl border-2 bg-[var(--ruggy-surface)] p-3 outline-none sm:p-4 ${
          fieldErrors.pickupDate
            ? "border-[var(--ruggy-error)]"
            : "border-[var(--ruggy-border-strong)]"
        }`}
      >
        <DayPicker
          className="order-calendar"
          disabled={[{ before: minimumBookingDate }, ...blockedDates]}
          mode="single"
          onSelect={setSelected}
          selected={selected}
          modifiersClassNames={{
            disabled: "my-disabled",
          }}
        />
      </div>
      <FieldError
        id={fieldErrorId("pickupDate")}
        message={fieldErrors.pickupDate}
      />
    </section>
  );
};
