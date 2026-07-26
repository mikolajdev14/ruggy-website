---
target: the /zamow order flow
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-07-26T08-58-49Z
slug: app-zamow-page-tsx
---
Method: dual-agent (A: design review · B: detector + static evidence). No browser automation in this environment — Assessment B is detector + source-verified evidence only; no live overlay.

## Design Health Score (Operate mode — all 10 heuristics apply)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Strong loading/submit/live-summary states; cross-page step signal is broken and size recap is generic ("Gotowy rozmiar"). |
| 2 | Match System / Real World | 4 | Excellent first-person Polish persona voice; labels map cleanly to real tasks. |
| 3 | User Control and Freedom | 3 | Back / "Zmień wariant" / cancel-recovery all present, but the anti-slip upsell is force-injected between submit and checkout. |
| 4 | Consistency and Standards | 3 | Tight card/shadow system, but "Krok pierwszy" appears on two pages, configurator h1 drops to font-semibold, two header links use h-9 not min-h-11. |
| 5 | Error Prevention | 3 | Blocked/too-close dates struck out, file guards, min/max/required, Zod — but validation only fires on submit. |
| 6 | Recognition Rather Than Recall | 2 | Chosen papadywany subrodzaj never echoed; preset size shows as "Gotowy rozmiar" (no label/price); zaplac makes users recall their project. |
| 7 | Flexibility and Efficiency | 3 | Popular-size defaulting, whole-card link targets, suggested amounts, sticky CTA. |
| 8 | Aesthetic and Minimalist | 3 | Beautiful masthead; configurator dense (gallery + 3 panels) but organized. |
| 9 | Error Recovery | 3 | Retry copy, submit-failure messages, cancelled-payment recovery, inline errors + focus-first-invalid. |
| 10 | Help and Documentation | 3 | Rich contextual help, but no upfront explanation of the two order modes. |
| **Total** | | **30/40** | **Good** |

## Design Specificity Verdict — Authored

The flow is authored for Ruggy, not category-interchangeable. `PosterHero` is the tell: a faint full-bleed marquee of the literal product word ghosting behind a colossal `clamp(2.75rem, 9.5vw, 7.5rem)` headline that rises per-word with a hand-swiped sunflower highlight sewing in under the emphasized word. Coherent token system (warm canvas, cobalt, sunflower, ink), Lobster wordmark, Archivo Black type, consistent neo-brutalist hard-offset shadows, and a strong persona voice ("Twój wymiar, moja włóczka") seal it. Dilution: the configurator interior is a fairly generic stacked three-panel form, and its h1 drops to font-semibold, breaking the black-weight language.

**Deterministic scan:** detector ran clean across all 7 markup files — `[]`, exit 0, zero findings. No canonical-class false positives to suppress this run. **Browser overlay:** unavailable (no browser automation exposed); no dev server or injection attempted.

## What's Working

1. **Sticky recap + reassurance bar** (`[id]/page.tsx:569–645`) — one persistent element does live recap, validation-error surface (`role="alert"`), submit progress (`aria-live`), and trust copy, keeping the primary action in thumb reach. Strongest single decision in the flow.
2. **Deliberate a11y scaffolding** — shared `useDialogChrome` (scroll-lock, focus trap, focus-restore, opt-in Escape), `FIELD_FOCUS_ORDER` focus-first-invalid in visual order, `aria-pressed`/`aria-live`/`aria-labelledby` throughout. Above the bar for a small-brand shop.
3. **Authored masthead + persona voice**, fully `prefers-reduced-motion`-guarded (`globals.css:340–359` + global catch-all `:377–384`).

## Priority Issues

**[P1] Payment moment doesn't confirm the size.** The sticky summary renders `"Gotowy rozmiar"` for any preset pick (`[id]/page.tsx:375`), dropping the actual label and price right before an irreversible Stripe redirect. Fix: show selected format label + price (both already in `SizePicker` state). → clarify

**[P1] Chosen papadywany subrodzaj is never echoed.** After picking a motif on `/podrodzaj`, the configurator shows only `rugType?.name` (`[id]/page.tsx:475`) + a "Zmień podrodzaj" link — the specific motif is invisible for the one line with a mandatory upstream choice. Fix: surface the variant name in the hero block and sticky summary. → clarify

**[P1] Modal gate controls have no visible focus indicator.** `ContentWarningDialog` actions (`[id]/page.tsx:867–871` link, `:873–880` accept button) carry only `hover:` styling — no `focus-visible:outline-*`, inconsistent with every other dialog (AntiSlipOfferDialog `:762`/`:770`, ContactSuccessDialog `:814`/`:823`). A keyboard user has no visible focus on a scroll-locked gate. Fix: add the standard focus-visible outline. → harden

**[P2] Cross-page step model is incoherent.** `/zamow` and `/podrodzaj` both label themselves "Krok pierwszy" (`page.tsx:67`, `podrodzaj/page.tsx:90`); the configurator uses "Zamówienie" with no step. Fix: one shared stepper (1 Wybór → 2 Podrodzaj [conditional] → 3 Konfiguracja → Płatność). → onboard

**[P2] Upsell injected at the conversion moment.** `AntiSlipOfferDialog` fires after the user clicks submit/pay (`[id]/page.tsx:350`), inserting a paid add-on where they expected to pay — reads as a dark pattern. Fix: move anti-slip inline as an opt-in checkbox within a panel. → distill

**[P2] Two sub-44px tap targets.** "Zmień podrodzaj" (`[id]/page.tsx:422`) and "Zmień wariant" (`:430`) use `h-9` (36px) with no `min-h`, while every other nav link uses `min-h-11`. Fix: bump to `min-h-11`. → adapt

## Persona Red Flags

**Jordan (first-timer):** no model for why some rugs are "online payment" vs "Instagram quote" — clicking a card lands them in two very different destinations unannounced; hits the papadywany content-warning modal with no context; sees "Krok pierwszy" twice; "Gotowy rozmiar" hides what they're paying for; anti-slip modal after pressing pay may read as an error.

**Sam (a11y / keyboard / SR):** single-select groups are `aria-pressed` toggle buttons, not radio groups — `SizePicker` (`size-picker.tsx:398`), `DeliveryPicker` (`delivery-picker.tsx:72`), zaplac amounts (`zaplac/page.tsx:128`) — SR announces "pressed/not pressed" not "selected, 1 of 6," no arrow-key roving. Calendar blocked dates signalled by `line-through` + `#8b919a` color only (`date-picker.tsx:57–61`), borderline contrast; error association sits on a `tabIndex=-1` wrapper, not the day buttons. Plus the ContentWarningDialog focus gap above.

**Casey (one-handed mobile):** must scroll past a `7.5rem` masthead + `CategoryRealizations` gallery before reaching any input; configurator is one long single-focus screen. Sticky submit bar mitigates the action, not the reach. Keeps: consistent `min-h-11/12` targets, `inputMode="numeric"`, whole-card links.

**Instagram follower → /zamow/zaplac:** the only in-site entry is buried at the *bottom* of the catalog (`page.tsx:127–150`); order identified only by free-text "Którego projektu dotyczy płatność?" (`zaplac/page.tsx:190`) with no reference ID; presets (300–1000) may anchor someone told an exact figure.

## Minor Observations

- Configurator h1 uses `font-semibold` (`[id]/page.tsx:446`) — off the editorial black-weight everywhere else.
- `DeliveryPicker` uses `text-left` (`delivery-picker.tsx:75`) vs logical `text-start` used elsewhere.
- Preset size price uses raw `Number(size.price_cents)/100` (`size-picker.tsx:420`) instead of the shared `formatPriceCents` — can print `199.9 zł`, won't match card "od …" formatting.
- Client-rendered configurator has no route-level skeleton; content pops in as data resolves.
- "Popularne" badge at `-top-2` overlaps the button's focus-outline region (`size-picker.tsx:407`).

## Questions to Consider

1. Is this a wizard or a long form pretending to be steps? Why two "Krok pierwszy" pages and no stepper?
2. Is the anti-slip gate costing conversions/trust to earn a small add-on?
3. At payment the user is told the connection is secure but never shown *what they're buying* — is "secure" masking an order-correctness gap?
4. Does interrupting the highest-intent papadywany users with an ominous modal cost more than the edge earns?
5. The Instagram-quote path fills a *complete* configurator then defers price/payment to DMs — how much of that entry is wasted?
