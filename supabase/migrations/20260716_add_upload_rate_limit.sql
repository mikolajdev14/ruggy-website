create table if not exists public.upload_rate_limits (
  key text primary key,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.upload_rate_limits enable row level security;

revoke all on public.upload_rate_limits from anon, authenticated;

create or replace function public.consume_upload_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_attempts integer;
begin
  delete from public.upload_rate_limits
  where updated_at < now() - interval '2 days';

  insert into public.upload_rate_limits (
    key,
    window_started_at,
    attempts,
    updated_at
  )
  values (p_key, now(), 1, now())
  on conflict (key) do update
  set
    attempts = case
      when upload_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
        then 1
      else upload_rate_limits.attempts + 1
    end,
    window_started_at = case
      when upload_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
        then now()
      else upload_rate_limits.window_started_at
    end,
    updated_at = now()
  returning attempts into current_attempts;

  return current_attempts <= p_limit;
end;
$$;

revoke execute on function public.consume_upload_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_upload_rate_limit(text, integer, integer)
  to service_role;
