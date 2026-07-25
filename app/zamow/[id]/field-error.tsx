import { TriangleAlert } from "lucide-react";

// Shared field-validation chrome so every control in the checkout signals an
// error the same way: a red border, an inline message a screen reader can tie
// back via aria-describedby, and a stable id the parent form can focus.

// Visual, top-to-bottom order of the form controls. The parent walks this to
// decide which invalid field to scroll to and focus first on a failed submit.
export const FIELD_FOCUS_ORDER = [
  "customWidthCm",
  "customHeightCm",
  "pickupDate",
  "deliveryMethod",
  "parcelLockerCode",
  "deliveryAddress",
  "customerName",
  "customerEmail",
] as const;

export type FieldErrors = Record<string, string>;

export const fieldErrorId = (field: string) => `${field}-error`;

const baseFieldClass =
  "w-full rounded-xl border-2 bg-[var(--ruggy-surface)] text-base font-bold text-[var(--ruggy-ink)] outline-none transition-colors placeholder:text-[var(--ruggy-muted)] focus:ring-4";
const validStateClass =
  "border-[var(--ruggy-border-strong)] hover:border-[var(--ruggy-ink)] focus:border-[var(--ruggy-blue)] focus:ring-[var(--ruggy-blue-soft)]";
const invalidStateClass =
  "border-[var(--ruggy-error)] hover:border-[var(--ruggy-error)] focus:border-[var(--ruggy-error)] focus:ring-[var(--ruggy-error)]/20";

export const buildFieldClass = (invalid?: boolean, multiline = false) =>
  `${baseFieldClass} ${multiline ? "min-h-28 resize-y px-4 py-3" : "h-12 px-4"} ${
    invalid ? invalidStateClass : validStateClass
  }`;

export function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="flex items-start gap-1.5 text-sm font-bold text-[var(--ruggy-error)]"
    >
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
