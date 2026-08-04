type OrderLegalNoticeProps = {
  actionLabel: string;
};

export function OrderLegalNotice({ actionLabel }: OrderLegalNoticeProps) {
  const linkClassName =
    "font-black text-[var(--ruggy-ink)] underline decoration-[var(--ruggy-border-strong)] underline-offset-2 transition-colors hover:decoration-[var(--ruggy-blue)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ruggy-blue)]";

  return (
    <p className="text-xs leading-5 text-[var(--ruggy-body)]">
      Klikając „{actionLabel}”, potwierdzasz zapoznanie się z{" "}
      <a href="/regulamin" className={linkClassName}>
        Regulaminem
      </a>
      ,{" "}
      <a href="/polityka-prywatnosci" className={linkClassName}>
        Polityką prywatności
      </a>{" "}
      i{" "}
      <a href="/zwroty" className={linkClassName}>
        zasadami zwrotów
      </a>
      .
    </p>
  );
}
