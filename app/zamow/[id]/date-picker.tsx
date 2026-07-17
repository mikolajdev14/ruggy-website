"use client";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Booking } from "./page";
import type { Dispatch, SetStateAction } from "react";

type DatePickerProps = {
  setBooking: Dispatch<SetStateAction<Booking>>;
  blockedDates: Date[];
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

export const DatePicker = ({ setBooking, blockedDates }: DatePickerProps) => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [today] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  useEffect(() => {
    setBooking((prev) => ({ ...prev, pickupDate: selected ?? null }));
  }, [selected, setBooking]);

  return (
    <section className="space-y-4">
      <style>{css}</style>
      <div>
        <p className="text-sm font-semibold text-neutral-950">
          Termin realizacji
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Dni wcześniejsze oraz zajęte są wyszarzone i przekreślone.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 sm:p-4">
        <DayPicker
          className="order-calendar"
          disabled={[{ before: today }, ...blockedDates]}
          mode="single"
          onSelect={setSelected}
          selected={selected}
          modifiersClassNames={{
            disabled: "my-disabled",
          }}
        />
      </div>
    </section>
  );
};
