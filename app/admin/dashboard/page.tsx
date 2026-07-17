import { createAdminClient } from "@/lib/supabase/admin";
import { createClientServer } from "@/lib/supabase/server";
import {
  CalendarRange,
  ExternalLink,
  LayoutDashboard,
  PackageSearch,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-btn";
import AdminDashboardClient, { type AdminBooking } from "./dashboard-client";

const REFERENCE_IMAGES_BUCKET = "booking-reference-images";

type BookingRow = {
  id: number | string;
  rug_type_id: number | string | null;
  rug_size_id: number | string | null;
  rug_type_name: string | null;
  rug_size_label: string | null;
  price_cents: number | string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  notes: string | null;
  booking_date: string | null;
  status: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  delivery_method: string | null;
  parcel_locker_code: string | null;
  delivery_address: string | null;
  reference_image_path: string | null;
};

export default async function AdminDashboardPage() {
  const serverSupabase = await createClientServer();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();
  const [
    { data: bookingRows, error: bookingsError },
    { data: blockedRows, error: blockedError },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        "id, rug_type_id, rug_size_id, rug_type_name, rug_size_label, price_cents, customer_name, customer_email, customer_phone, notes, booking_date, status, stripe_session_id, stripe_payment_intent_id, expires_at, created_at, updated_at, delivery_method, parcel_locker_code, delivery_address, reference_image_path",
      )
      .order("created_at", { ascending: false }),
    supabase.from("blocked_dates").select("date").order("date"),
  ]);

  const bookings =
    (bookingRows as BookingRow[] | null)?.map((booking) => ({
      id: Number(booking.id),
      rugTypeId:
        booking.rug_type_id == null ? null : Number(booking.rug_type_id),
      rugSizeId:
        booking.rug_size_id == null ? null : Number(booking.rug_size_id),
      rugTypeName: booking.rug_type_name,
      rugSizeLabel: booking.rug_size_label,
      priceCents:
        booking.price_cents == null ? null : Number(booking.price_cents),
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      notes: booking.notes,
      bookingDate: booking.booking_date,
      status: booking.status ?? "paid",
      stripeSessionId: booking.stripe_session_id,
      stripePaymentIntentId: booking.stripe_payment_intent_id,
      expiresAt: booking.expires_at,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      deliveryMethod: booking.delivery_method,
      parcelLockerCode: booking.parcel_locker_code,
      deliveryAddress: booking.delivery_address,
      referenceImagePath: booking.reference_image_path,
      referenceImageUrl: null as string | null,
    })) ?? [];

  await Promise.all(
    bookings.map(async (booking) => {
      if (!booking.referenceImagePath) {
        return;
      }

      const { data, error } = await supabase.storage
        .from(REFERENCE_IMAGES_BUCKET)
        .createSignedUrl(booking.referenceImagePath, 60 * 60);

      if (!error && data?.signedUrl) {
        booking.referenceImageUrl = data.signedUrl;
      }
    }),
  );

  const blockedDates =
    blockedRows
      ?.map((row) => row.date)
      .filter((date): date is string => Boolean(date)) ?? [];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#0a0a0a]">
      <div className="min-h-screen lg:grid lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#e5e5e5] bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div className="border-b border-[#e5e5e5] px-6 py-6">
            <p className="ruggy-wordmark text-3xl text-neutral-950">ruggy.</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#737373]">
              Studio dywanów
            </p>
          </div>

          <nav
            className="flex-1 space-y-1 px-3 py-5"
            aria-label="Panel administracyjny"
          >
            <a
              href="#overview"
              className="flex h-10 items-center gap-3 rounded-md bg-[#ffe44c] px-3 text-sm font-semibold text-neutral-950"
            >
              <LayoutDashboard size={17} aria-hidden="true" />
              Pulpit
            </a>
            <a
              href="#orders"
              className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#525252] transition-colors hover:bg-[#fafafa] hover:text-[#0a0a0a]"
            >
              <PackageSearch size={17} aria-hidden="true" />
              Zamówienia
            </a>
            <a
              href="#calendar"
              className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#525252] transition-colors hover:bg-[#fafafa] hover:text-[#0a0a0a]"
            >
              <CalendarRange size={17} aria-hidden="true" />
              Kalendarz
            </a>
          </nav>

          <div className="border-t border-[#e5e5e5] p-4">
            <Link
              href="/"
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-[#525252] hover:bg-[#fafafa] hover:text-[#0a0a0a]"
            >
              Przejdź do witryny
              <ExternalLink size={15} aria-hidden="true" />
            </Link>
            <div className="mt-3 flex items-center gap-3 rounded-md bg-[#fafafa] p-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0a0a0a] text-xs font-semibold text-white">
                {user.email?.slice(0, 1).toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0a0a0a]">
                  Administrator
                </p>
                <p className="truncate text-[11px] text-[#737373]">
                  {user.email}
                </p>
              </div>
              <LogoutButton compact />
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#e5e5e5] bg-white/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="lg:hidden">
                  <p className="ruggy-wordmark text-2xl text-neutral-950">
                    ruggy.
                  </p>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-[#0a0a0a]">
                    Panel administracyjny
                  </p>
                  <p className="text-xs text-[#737373]">Zarządzanie studiem</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-2 text-xs font-medium text-[#525252] sm:flex">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  System aktywny
                </span>
                <div className="lg:hidden">
                  <LogoutButton />
                </div>
              </div>
            </div>

            <nav
              className="flex gap-1 overflow-x-auto border-t border-[#e5e5e5] px-3 py-2 lg:hidden"
              aria-label="Sekcje panelu"
            >
              <a
                href="#overview"
                className="whitespace-nowrap rounded-md bg-[#ffe44c] px-3 py-1.5 text-xs font-semibold text-neutral-950"
              >
                Pulpit
              </a>
              <a
                href="#orders"
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-[#525252]"
              >
                Zamówienia
              </a>
              <a
                href="#calendar"
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-[#525252]"
              >
                Kalendarz
              </a>
            </nav>
          </header>

          <main className="w-full px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            {bookingsError || blockedError ? (
              <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                Nie udało się pobrać wszystkich danych panelu. Sprawdź
                połączenie z Supabase.
              </div>
            ) : null}

            <AdminDashboardClient
              initialBookings={bookings as AdminBooking[]}
              initialBlockedDates={blockedDates}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
