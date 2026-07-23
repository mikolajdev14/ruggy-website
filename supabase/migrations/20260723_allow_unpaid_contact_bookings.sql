alter table public.bookings
  alter column customer_phone drop not null,
  alter column stripe_session_id drop not null,
  alter column stripe_payment_intent_id drop not null,
  alter column expires_at drop not null;
