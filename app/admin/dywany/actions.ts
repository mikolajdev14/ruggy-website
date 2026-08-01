"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClientServer } from "@/lib/supabase/server";
import {
  rugSizeSchema,
  rugTypeSchema,
  rugVariantSchema,
  type RugSizeInput,
  type RugTypeInput,
  type RugVariantInput,
} from "@/schema/rug-catalog";
import { revalidatePath } from "next/cache";

export type CatalogActionResult = { success: boolean; message?: string };

// Server Functions are reachable by direct POST, so every entry point below
// re-checks the admin session before touching the service-role client.
const getAdminClient = async () => {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? createAdminClient() : null;
};

const SESSION_EXPIRED: CatalogActionResult = {
  success: false,
  message: "Sesja administratora wygasła. Zaloguj się ponownie.",
};

const isPositiveId = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) > 0;

const firstIssueMessage = (error: { issues: Array<{ message: string }> }) =>
  error.issues[0]?.message ?? "Nieprawidłowe dane.";

// The public order flow is ISR-cached; the configurator itself reads live but
// its parent routes do not. Refresh every surface that renders the catalog.
const revalidateCatalog = () => {
  revalidatePath("/admin/dywany");
  revalidatePath("/zamow");
  revalidatePath("/zamow/[id]", "page");
  revalidatePath("/zamow/[id]/podrodzaj", "page");
};

/** Postgres unique-violation, i.e. the slug is already taken. */
const isDuplicateSlug = (error: { code?: string }) => error.code === "23505";

// A row that a booking points at is order history: its name/price snapshot is
// what the customer bought. Deleting it would orphan (or silently blank) that
// record, so deletion is refused and deactivation offered instead.
const countBookingsReferencing = async (
  supabase: ReturnType<typeof createAdminClient>,
  column: "rug_type_id" | "rug_variant_id" | "rug_size_id",
  ids: number[],
) => {
  if (!ids.length) return 0;

  const { count, error } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .in(column, ids);

  if (error) {
    console.error("Nie udało się sprawdzić powiązanych zamówień:", error);
    return null;
  }

  return count ?? 0;
};

const blockedByBookingsMessage = (
  subject: "Ta kategoria" | "Ten podrodzaj" | "Ten rozmiar",
) => {
  const [deleted, deactivated] =
    subject === "Ta kategoria"
      ? ["usunięta", "nieaktywną"]
      : ["usunięty", "nieaktywny"];

  return `${subject} ma powiązane zamówienia i nie może zostać ${deleted}. Ustaw ${
    subject === "Ta kategoria" ? "ją" : "go"
  } jako ${deactivated} — zniknie z oferty, a historia zamówień zostanie nietknięta.`;
};

/* ------------------------------------------------------------------ types */

export async function createRugType(
  input: RugTypeInput,
): Promise<CatalogActionResult> {
  const parsed = rugTypeSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: firstIssueMessage(parsed.error) };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const values = parsed.data;
  const { error } = await supabase.from("rug_types").insert({
    name: values.name,
    slug: values.slug,
    description: values.description,
    lead_time_days: values.leadTimeDays,
    display_order: values.displayOrder,
    is_active: values.isActive,
  });

  if (error) {
    console.error("Nie udało się dodać kategorii dywanów:", error);
    return {
      success: false,
      message: isDuplicateSlug(error)
        ? "Kategoria z tym slugiem już istnieje."
        : "Nie udało się dodać kategorii.",
    };
  }

  revalidateCatalog();
  return { success: true, message: `Kategoria „${values.name}” została dodana.` };
}

export async function updateRugType(
  id: number,
  input: RugTypeInput,
): Promise<CatalogActionResult> {
  if (!isPositiveId(id)) {
    return { success: false, message: "Nieprawidłowa kategoria." };
  }

  const parsed = rugTypeSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: firstIssueMessage(parsed.error) };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const values = parsed.data;
  const { error } = await supabase
    .from("rug_types")
    .update({
      name: values.name,
      slug: values.slug,
      description: values.description,
      lead_time_days: values.leadTimeDays,
      display_order: values.displayOrder,
      is_active: values.isActive,
    })
    .eq("id", id);

  if (error) {
    console.error("Nie udało się zapisać kategorii dywanów:", error);
    return {
      success: false,
      message: isDuplicateSlug(error)
        ? "Kategoria z tym slugiem już istnieje."
        : "Nie udało się zapisać kategorii.",
    };
  }

  revalidateCatalog();
  return { success: true, message: "Kategoria została zapisana." };
}

export async function deleteRugType(id: number): Promise<CatalogActionResult> {
  if (!isPositiveId(id)) {
    return { success: false, message: "Nieprawidłowa kategoria." };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const [{ data: variantRows, error: variantsError }, { data: sizeRows }] =
    await Promise.all([
      supabase.from("rug_variants").select("id").eq("rug_type_id", id),
      supabase.from("rug_sizes").select("id").eq("rug_type_id", id),
    ]);

  if (variantsError) {
    console.error("Nie udało się pobrać podrodzajów kategorii:", variantsError);
    return { success: false, message: "Nie udało się usunąć kategorii." };
  }

  const variantIds = (variantRows ?? []).map((row) => Number(row.id));
  const sizeIds = (sizeRows ?? []).map((row) => Number(row.id));

  if (variantIds.length) {
    const { data: variantSizeRows, error: variantSizesError } = await supabase
      .from("rug_sizes")
      .select("id")
      .in("rug_variant_id", variantIds);

    if (variantSizesError) {
      console.error(
        "Nie udało się pobrać rozmiarów podrodzajów:",
        variantSizesError,
      );
      return { success: false, message: "Nie udało się usunąć kategorii." };
    }

    sizeIds.push(...(variantSizeRows ?? []).map((row) => Number(row.id)));
  }

  const [typeUsage, variantUsage, sizeUsage] = await Promise.all([
    countBookingsReferencing(supabase, "rug_type_id", [id]),
    countBookingsReferencing(supabase, "rug_variant_id", variantIds),
    countBookingsReferencing(supabase, "rug_size_id", sizeIds),
  ]);

  if (typeUsage == null || variantUsage == null || sizeUsage == null) {
    return { success: false, message: "Nie udało się usunąć kategorii." };
  }

  if (typeUsage + variantUsage + sizeUsage > 0) {
    return {
      success: false,
      message: blockedByBookingsMessage("Ta kategoria"),
    };
  }

  // Children first: rug_sizes and rug_variants both point back at the type, so
  // the parent row can only go once nothing references it.
  if (sizeIds.length) {
    const { error } = await supabase.from("rug_sizes").delete().in("id", sizeIds);

    if (error) {
      console.error("Nie udało się usunąć rozmiarów kategorii:", error);
      return { success: false, message: "Nie udało się usunąć rozmiarów kategorii." };
    }
  }

  if (variantIds.length) {
    const { error } = await supabase
      .from("rug_variants")
      .delete()
      .in("id", variantIds);

    if (error) {
      console.error("Nie udało się usunąć podrodzajów kategorii:", error);
      return {
        success: false,
        message: "Nie udało się usunąć podrodzajów kategorii.",
      };
    }
  }

  const { error } = await supabase.from("rug_types").delete().eq("id", id);

  if (error) {
    console.error("Nie udało się usunąć kategorii dywanów:", error);
    return { success: false, message: "Nie udało się usunąć kategorii." };
  }

  revalidateCatalog();
  return { success: true, message: "Kategoria została usunięta." };
}

/* --------------------------------------------------------------- variants */

export async function createRugVariant(
  rugTypeId: number,
  input: RugVariantInput,
): Promise<CatalogActionResult> {
  if (!isPositiveId(rugTypeId)) {
    return { success: false, message: "Nieprawidłowa kategoria." };
  }

  const parsed = rugVariantSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: firstIssueMessage(parsed.error) };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const values = parsed.data;
  const { error } = await supabase.from("rug_variants").insert({
    rug_type_id: rugTypeId,
    name: values.name,
    slug: values.slug,
    description: values.description,
    display_order: values.displayOrder,
    is_active: values.isActive,
  });

  if (error) {
    console.error("Nie udało się dodać podrodzaju:", error);
    return {
      success: false,
      message: isDuplicateSlug(error)
        ? "Podrodzaj z tym slugiem już istnieje w tej kategorii."
        : "Nie udało się dodać podrodzaju.",
    };
  }

  revalidateCatalog();
  return { success: true, message: `Podrodzaj „${values.name}” został dodany.` };
}

export async function updateRugVariant(
  id: number,
  input: RugVariantInput,
): Promise<CatalogActionResult> {
  if (!isPositiveId(id)) {
    return { success: false, message: "Nieprawidłowy podrodzaj." };
  }

  const parsed = rugVariantSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: firstIssueMessage(parsed.error) };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const values = parsed.data;
  const { error } = await supabase
    .from("rug_variants")
    .update({
      name: values.name,
      slug: values.slug,
      description: values.description,
      display_order: values.displayOrder,
      is_active: values.isActive,
    })
    .eq("id", id);

  if (error) {
    console.error("Nie udało się zapisać podrodzaju:", error);
    return {
      success: false,
      message: isDuplicateSlug(error)
        ? "Podrodzaj z tym slugiem już istnieje w tej kategorii."
        : "Nie udało się zapisać podrodzaju.",
    };
  }

  revalidateCatalog();
  return { success: true, message: "Podrodzaj został zapisany." };
}

export async function deleteRugVariant(
  id: number,
): Promise<CatalogActionResult> {
  if (!isPositiveId(id)) {
    return { success: false, message: "Nieprawidłowy podrodzaj." };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const { data: sizeRows, error: sizesError } = await supabase
    .from("rug_sizes")
    .select("id")
    .eq("rug_variant_id", id);

  if (sizesError) {
    console.error("Nie udało się pobrać rozmiarów podrodzaju:", sizesError);
    return { success: false, message: "Nie udało się usunąć podrodzaju." };
  }

  const sizeIds = (sizeRows ?? []).map((row) => Number(row.id));
  const [variantUsage, sizeUsage] = await Promise.all([
    countBookingsReferencing(supabase, "rug_variant_id", [id]),
    countBookingsReferencing(supabase, "rug_size_id", sizeIds),
  ]);

  if (variantUsage == null || sizeUsage == null) {
    return { success: false, message: "Nie udało się usunąć podrodzaju." };
  }

  if (variantUsage + sizeUsage > 0) {
    return {
      success: false,
      message: blockedByBookingsMessage("Ten podrodzaj"),
    };
  }

  if (sizeIds.length) {
    const { error } = await supabase.from("rug_sizes").delete().in("id", sizeIds);

    if (error) {
      console.error("Nie udało się usunąć rozmiarów podrodzaju:", error);
      return {
        success: false,
        message: "Nie udało się usunąć rozmiarów podrodzaju.",
      };
    }
  }

  const { error } = await supabase.from("rug_variants").delete().eq("id", id);

  if (error) {
    console.error("Nie udało się usunąć podrodzaju:", error);
    return { success: false, message: "Nie udało się usunąć podrodzaju." };
  }

  revalidateCatalog();
  return { success: true, message: "Podrodzaj został usunięty." };
}

/* ------------------------------------------------------------------ sizes */

export async function createRugSize(
  owner: { rugTypeId: number | null; rugVariantId: number | null },
  input: RugSizeInput,
): Promise<CatalogActionResult> {
  const ownsType = isPositiveId(owner.rugTypeId);
  const ownsVariant = isPositiveId(owner.rugVariantId);

  // A size hangs off exactly one owner: the category (its sizes are shown
  // directly) or one of its subrodzajs. Both at once would double-list it.
  if (ownsType === ownsVariant) {
    return {
      success: false,
      message: "Rozmiar musi należeć do kategorii albo do podrodzaju.",
    };
  }

  const parsed = rugSizeSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: firstIssueMessage(parsed.error) };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const values = parsed.data;
  const { error } = await supabase.from("rug_sizes").insert({
    rug_type_id: ownsType ? owner.rugTypeId : null,
    rug_variant_id: ownsVariant ? owner.rugVariantId : null,
    label: values.label,
    width_cm: values.widthCm,
    price_cents: values.priceCents,
    display_order: values.displayOrder,
    is_active: values.isActive,
  });

  if (error) {
    console.error("Nie udało się dodać rozmiaru:", error);
    return { success: false, message: "Nie udało się dodać rozmiaru." };
  }

  revalidateCatalog();
  return { success: true, message: `Rozmiar „${values.label}” został dodany.` };
}

export async function updateRugSize(
  id: number,
  input: RugSizeInput,
): Promise<CatalogActionResult> {
  if (!isPositiveId(id)) {
    return { success: false, message: "Nieprawidłowy rozmiar." };
  }

  const parsed = rugSizeSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: firstIssueMessage(parsed.error) };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const values = parsed.data;
  const { error } = await supabase
    .from("rug_sizes")
    .update({
      label: values.label,
      width_cm: values.widthCm,
      price_cents: values.priceCents,
      display_order: values.displayOrder,
      is_active: values.isActive,
    })
    .eq("id", id);

  if (error) {
    console.error("Nie udało się zapisać rozmiaru:", error);
    return { success: false, message: "Nie udało się zapisać rozmiaru." };
  }

  revalidateCatalog();
  return { success: true, message: "Rozmiar został zapisany." };
}

export async function deleteRugSize(id: number): Promise<CatalogActionResult> {
  if (!isPositiveId(id)) {
    return { success: false, message: "Nieprawidłowy rozmiar." };
  }

  const supabase = await getAdminClient();
  if (!supabase) return SESSION_EXPIRED;

  const usage = await countBookingsReferencing(supabase, "rug_size_id", [id]);

  if (usage == null) {
    return { success: false, message: "Nie udało się usunąć rozmiaru." };
  }

  if (usage > 0) {
    return { success: false, message: blockedByBookingsMessage("Ten rozmiar") };
  }

  const { error } = await supabase.from("rug_sizes").delete().eq("id", id);

  if (error) {
    console.error("Nie udało się usunąć rozmiaru:", error);
    return { success: false, message: "Nie udało się usunąć rozmiaru." };
  }

  revalidateCatalog();
  return { success: true, message: "Rozmiar został usunięty." };
}
