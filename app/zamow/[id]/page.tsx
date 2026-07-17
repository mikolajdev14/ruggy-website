"use client";

import { createClient } from "@/lib/supabase/client";
import { formatLocalDateKey } from "@/lib/booking-date";
import {
  calculateCustomRugPriceCents,
  formatPriceCents,
} from "@/lib/custom-rug-price";
import { bookingSchema } from "@/schema/booking";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  use,
  useEffect,
  useState,
} from "react";
import { createCheckoutSession, uploadReferenceImage } from "./actions";
import { CustomerForm } from "./customer-form";
import { DatePicker } from "./date-picker";
import { DeliveryPicker } from "./delivery-picker";
import { ReferenceImageUpload } from "./reference-image-upload";
import { SizePicker } from "./size-picker";

export type DeliveryMethod = "parcel_locker" | "courier";

export type Booking = {
  rugTypeId: string;
  pickedSize: number | null;
  customWidthCm: number | null;
  customHeightCm: number | null;
  pickupDate: Date | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes: string;
  deliveryMethod: DeliveryMethod | "";
  parcelLockerCode: string;
  deliveryAddress: string;
};

type RugTypeSummary = {
  name: string;
  description: string | null;
  lead_time_days: number | null;
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blockedDays, setBlockedDays] = useState<Date[]>([]);
  const [rugType, setRugType] = useState<RugTypeSummary | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string>();
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking>({
    rugTypeId: id,
    pickedSize: null,
    customWidthCm: null,
    customHeightCm: null,
    pickupDate: null,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerNotes: "",
    deliveryMethod: "",
    parcelLockerCode: "",
    deliveryAddress: "",
  });

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const loadPageData = async () => {
      const [{ data: blockedDates }, { data: selectedRugType }] =
        await Promise.all([
          supabase.from("blocked_dates").select("date"),
          supabase
            .from("rug_types")
            .select("name, description, lead_time_days")
            .eq("id", id)
            .single(),
        ]);

      if (!isMounted) return;

      setBlockedDays(blockedDates?.map((item) => new Date(item.date)) ?? []);
      setRugType(selectedRugType);
    };

    void loadPageData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const bookingInput = {
      ...booking,
      pickupDate: booking.pickupDate
        ? formatLocalDateKey(booking.pickupDate)
        : "",
      referenceImagePath: undefined,
    };

    const validation = bookingSchema.safeParse(bookingInput);

    if (!validation.success) {
      setSubmitMessage(
        validation.error.issues[0]?.message ?? "Nieprawidłowe dane.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(
      referenceImage
        ? "Przygotowuję zdjęcie i płatność..."
        : "Przygotowuję płatność...",
    );

    try {
      let referenceImagePath: string | undefined;

      if (referenceImage) {
        const uploadResponse = await uploadReferenceImage(referenceImage);

        if (!uploadResponse.success) {
          setSubmitMessage(uploadResponse.message);
          setIsSubmitting(false);
          return;
        }

        referenceImagePath = uploadResponse.path;
      }

      const response = await createCheckoutSession({
        ...bookingInput,
        referenceImagePath,
      });

      if (!response.success) {
        setSubmitMessage(response.message);
        setIsSubmitting(false);
        return;
      }

      window.location.href = response.checkoutUrl!;
    } catch (error) {
      console.error("Nie udało się przygotować zamówienia:", error);
      setSubmitMessage(
        "Nie udało się przygotować zamówienia. Spróbuj ponownie.",
      );
      setIsSubmitting(false);
    }
  };

  const selectedDate = booking.pickupDate
    ? new Intl.DateTimeFormat("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(booking.pickupDate)
    : "Nie wybrano";

  const selectedDelivery =
    booking.deliveryMethod === "parcel_locker"
      ? "Paczkomat InPost"
      : booking.deliveryMethod === "courier"
        ? "Kurier"
        : "Nie wybrano";

  const customPriceCents = calculateCustomRugPriceCents(
    booking.customWidthCm,
    booking.customHeightCm,
  );
  const selectedSize = booking.pickedSize
    ? "Gotowy rozmiar"
    : customPriceCents
      ? `${booking.customWidthCm} × ${booking.customHeightCm} cm · ${formatPriceCents(customPriceCents)}`
      : "Nie wybrano";

  return (
    <main className="min-h-screen bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      <header className="border-b border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)]">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <Link href="/" className="ruggy-wordmark text-4xl text-[var(--ruggy-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]">
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>
          <Link
            href="/zamow"
            className="inline-flex h-9 items-center gap-2 rounded-md px-2 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Zmień wariant
          </Link>
        </div>
      </header>

      <section className="ruggy-thread-bg bg-[var(--ruggy-blue-soft)] text-[var(--ruggy-ink)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-5 px-5 py-7 sm:px-8 sm:py-9 lg:flex-row lg:items-end lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ruggy-blue)]">
              Zamówienie
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Skonfiguruj swój dywan
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--ruggy-body)]">
              {rugType?.description ||
                "Wybierz szczegóły projektu, termin oraz sposób dostawy."}
            </p>
          </div>

          <div className="border-s-2 border-[var(--ruggy-ink)] ps-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ruggy-muted)]">
              Wybrany wariant
            </p>
            <p className="mt-1 text-base font-black text-[var(--ruggy-ink)]">
              {rugType?.name || `Wariant #${id}`}
            </p>
            {rugType?.lead_time_days ? (
              <p className="mt-0.5 text-xs text-[var(--ruggy-muted)]">
                Około {rugType.lead_time_days} dni realizacji
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8"
      >
        <div className="grid items-start gap-5 xl:grid-cols-2">
          <FormPanel number="1" title="Projekt i termin" description="Wybierz rozmiar oraz dzień realizacji">
            <div className="grid gap-7">
              <SizePicker id={id} booking={booking} setBooking={setBooking} />
              <DatePicker blockedDates={blockedDays} setBooking={setBooking} />
            </div>
          </FormPanel>

          <div className="grid gap-5">
            <FormPanel number="2" title="Dostawa" description="Wskaż sposób odbioru gotowego dywanu">
              <DeliveryPicker booking={booking} setBooking={setBooking} />
            </FormPanel>

            <FormPanel number="3" title="Materiał referencyjny" description="Dodaj zdjęcie, które będzie podstawą projektu">
              <ReferenceImageUpload
                file={referenceImage}
                setFile={setReferenceImage}
              />
            </FormPanel>
          </div>
        </div>

        <div className="mt-5">
          <FormPanel number="4" title="Dane zamawiającego" description="Dane kontaktowe i dodatkowe informacje">
            <CustomerForm booking={booking} setBooking={setBooking} />
          </FormPanel>
        </div>

        <div className="sticky bottom-3 z-20 mt-5 rounded-lg border border-neutral-300 bg-white/95 p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              {submitMessage ? (
                <p className="text-sm font-semibold text-neutral-950">
                  {submitMessage}
                </p>
              ) : (
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-500">
                  <span>
                    Rozmiar:{" "}
                    <strong className="text-neutral-800">
                      {selectedSize}
                    </strong>
                  </span>
                  <span>
                    Termin:{" "}
                    <strong className="text-neutral-800">{selectedDate}</strong>
                  </span>
                  <span>
                    Dostawa:{" "}
                    <strong className="text-neutral-800">
                      {selectedDelivery}
                    </strong>
                  </span>
                </div>
              )}
              <p className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                <ShieldCheck size={14} aria-hidden="true" />
                Bezpieczna płatność online przez Stripe
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--ruggy-blue)] px-6 text-sm font-black text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)] disabled:cursor-wait disabled:opacity-70"
            >
              <CreditCard size={17} aria-hidden="true" />
              {isSubmitting ? "Przygotowywanie..." : "Zapłać i zarezerwuj"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

function FormPanel({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3 border-b border-neutral-200 pb-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--ruggy-yellow)] text-xs font-black text-[var(--ruggy-ink)]">
          {number}
        </span>
        <div>
          <h2 className="text-base font-semibold text-neutral-950">{title}</h2>
          <p className="text-xs text-neutral-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
