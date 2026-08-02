---
target: app/zamow/[id]/page.tsx
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 5
timestamp: 2026-08-01T14-15-02Z
slug: app-zamow-id-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser evidence)

Target: `app/zamow/[id]/page.tsx` — Ruggy order configurator. Mode: **Operate** (conversion-critical).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No order total exists anywhere in the flow; 5 MB upload shows a static string with no progress; the `aria-live` region is created in the same commit as its text (`page.tsx:646`), so it likely never announces. |
| 2 | Match System / Real World | 3 | Warm, natural Polish throughout — undercut by internal vocabulary surfaced to buyers: "podrodzaj", "Materiał referencyjny", and the fallback `Wariant #{id}` (`page.tsx:528`), a database primary key rendered as a product name. |
| 3 | User Control and Freedom | 2 | Nothing survives a refresh, a phone call, or browser-back from Stripe. `ContactSuccessDialog` is terminal and undismissable. No review step between "Zapłać" and the redirect. |
| 4 | Consistency and Standards | 3 | Excellent shared field/dialog/radio primitives. But price formatting diverges (`size-picker.tsx:484` raw `/100` vs `formatPriceCents` everywhere else), the same fact is worded "ustalimy" at `page.tsx:514` and "ustalę" at `page.tsx:681`, and `radix-ui` is a dependency that this surface never imports — all four dialogs are hand-rolled. |
| 5 | Error Prevention | 3 | Blocked days disabled, lead time enforced, postal-code pattern, popular size preselected. But a bogus rug id renders a fully functional doomed configurator (`page.tsx:236`), notes truncate silently at 500, and a renamed `.pdf` passes the client-side type check. |
| 6 | Recognition Rather Than Recall | 3 | The sticky summary keeps size/date/delivery visible — then destroys itself and shows the error list instead on failed submit (`page.tsx:632-671`), exactly when re-reading it matters. |
| 7 | Flexibility and Efficiency | 2 | `autoComplete` on every contact/address field and a preselected popular size are real accelerators. Nothing persists between sessions; no typed date entry; no "najbliższy wolny termin" shortcut; `autoComplete="off"` on the paczkomat code (`delivery-picker.tsx:249`) blocks the one field a phone could actually fill. |
| 8 | Aesthetic and Minimalist Design | 3 | Coherent and genuinely pleasant. But a 5-photo gallery is injected between hero and first control on an Operate surface, the sticky bar multiplexes three content modes into one slot, and the detector found 3 nested-card instances and one sub-AA kicker. |
| 9 | Error Recovery | 2 | Inline field errors plus `focusFirstInvalidField` are better than most production checkouts — undermined by server internals leaked verbatim to customers ("Nie udało się ustalić adresu powrotu po płatności", `actions.ts:224`) and an upload error that is never announced. |
| 10 | Help and Documentation | 1 | Zero. No footer, no FAQ, and `/regulamin`, `/zwroty`, `/polityka-prywatnosci` all exist but are linked from nowhere in checkout. No definition of "podrodzaj". No contact route before submitting. |
| **Total** | | **24/40** | **Acceptable (20–27)** |

All ten heuristics apply — this is an Operate surface, not a landing page.

## Design Specificity Verdict

**The chrome is unmistakably Ruggy. The task surface underneath is a stock e-commerce checkout wearing it.**

**LLM assessment.** Real authorship exists in isolated places, and it is good: the calendar reframed as a workshop booking — *"To dzień, w którym zaczynam pracę nad Twoim dywanem"* (`date-picker.tsx:133`); the anti-slip upsell — *"A weź se dorzuć podkład antypoślizgowy, co byś se kostki nie skręcił"* (`page.tsx:744`); the custom-size panel's *"Twój wymiar, moja włóczka"*. The visual system — offset ink shadows, sunflower number badges, thread-dot texture — is consistent and non-generic.

But the largest block of the page, Panel 2 (`page.tsx:577-615`), contains no product at all: delivery radios, address fieldset, name/email/phone/notes, placeholder `"Jan Kowalski"`. The hero is `<h1>Skonfiguruj swój dywan</h1>` over a reused marketing description. Every size card repeats the identical string `"Gotowy format Ruggy"` where differentiation belongs. Swap "dywan" for "koszulka" and nothing breaks.

The sharpest miss: **the reference photo is the product** — your idea becomes a rug — and it is rendered as a bare unlabeled `<input type="file">` with a filename echo, no preview, no thumbnail (`reference-image-upload.tsx:63-89`). It is placed last, numbered step 3, described as *"Na końcu dodaj zdjęcie"*, and carries no required marker. The emotional heart of the product is the coldest, least designed element on the page.

Also absent: any scale reference for a physical object (`"60 cm"` plus a footnote is the entire size affordance), any resolution of lead time into an arrival date, and **the maker himself** — no face, no name, no "ponad 10 tys. obserwujących", on the one screen where a stranger decides to send 300–800 zł to a positioning built entirely on *"kontakt z konkretnym twórcą"*.

**Deterministic scan.** The CLI detector returned **0 findings, exit 0** over `app/zamow/[id]/`. Assessment B did not take that at face value — it verified the scan was real rather than a silent no-op: a deliberately bad probe file fired `ai-color-palette` and exit 2; a nonexistent path produced an access warning that did *not* appear for the real target; the files were re-scanned from a bracket-free path outside the project to defeat both glob and config effects; and `.impeccable/config.local.json` was confirmed to hold only hook consent, no ignore rules. **The clean CLI result is genuine.** For a 31 KB hand-written component that is a real credit to the codebase.

**Visual overlays.** Browser injection **succeeded**. Assessment B found Playwright 1.62.1 resolvable with a cached chromium-1187 binary, installed it to the scratchpad only (no project file touched), and drove a fresh context against the running dev server at `/zamow/3`. Preflight mutation passed (title set, `<script>` executed). The live server injected `detect.js`, the overlay rendered in-page (11 overlay elements, 8 `window.impeccable*` globals), and the console reported **8 findings across 6 elements**:

| Rule | Detail | Location |
|---|---|---|
| `low-contrast` | **4.2:1, needs 4.5:1** — `#2864f0` on `#dcecff` | kicker "Zamówienie", `page.tsx:494` |
| `cramped-padding` | 0px vertical padding | submit CTA, `page.tsx:690` — **false positive** |
| `kicker-above-heading` ×2 | kicker stacked above heading | `page.tsx:494→497`; `category-realizations.tsx` |
| `cream-palette` | `rgb(248,243,232)` page background | `body` — correct but not a defect |
| `nested-cards` ×3 | card inside card | `size-picker.tsx:~397`, `date-picker.tsx:146`, `reference-image-upload.tsx:62` |

Two of these I discount. `cramped-padding` is a **false positive**: the button sets `min-h-12 px-6` with flex centering and measures 48×229px live — the rule reads the literal `padding-top` property and misses that height comes from `min-height`. `cream-palette` is factually correct but flags `--ruggy-canvas`, a deliberate brand token documented in DESIGN.md. The `low-contrast`, `kicker-above-heading` and `nested-cards` findings are all genuine and verified against source.

**Where the detector beat the design review:** the 4.2:1 kicker, the three nested-card instances, and — most importantly — a responsive break neither review would have caught by reading code. At **320px the page overflows horizontally by 66px and the calendar's Sunday column is clipped off-screen.** Root cause traced: react-day-picker renders 42px day cells → a fixed 294px grid; `date-picker.tsx:36-38` sets `width: 100%` on the month grid but never shrinks the cells. Browser evidence also caught two layout problems: on desktop the sticky bar (`z-20`) **occludes the top of Panel 1**, cutting off the calendar helper text; and on mobile the "sticky" CTA is **absent for the entire first ~1.5 screens** (page is 4084px tall; the bar's containing block is the `<form>`, which starts below hero + gallery).

## Overall Impression

This is well-built software with a real voice and a genuinely strong accessibility foundation — and it is missing the one number the customer came here to see. There is **no order total anywhere in the flow**. Not in the sticky bar, not before the upsell, not before the Stripe redirect, and never at all on the quote path. The three facts are shown (`249 zł`, `17 zł`, `+39 zł`) and never summed. That directly violates Product Principle 4 — *"Pokazuj klientowi cenę, termin i kolejny krok przed podjęciem zobowiązania"* — and it is the single biggest opportunity here.

The second theme is **fragility around the commitment moment**: nothing survives an interruption, the quote path ends with no artefact of any kind, and the parcel-locker map cannot be entered by keyboard at all.

## What's Working

**1. The validation system is better than most production checkouts.** `field-error.tsx` gives every control one error grammar — red border, `aria-invalid`, inline message bound by `aria-describedby`, stable focus id. `FIELD_FOCUS_ORDER` plus `focusFirstInvalidField` (`page.tsx:129-142`) then scroll to and focus the first invalid control *in visual order*, deferred one frame because delivery sub-fields mount conditionally. That `requestAnimationFrame` is a detail almost nobody gets right.

**2. Radio semantics done properly, not nominally.** `use-radio-group.ts` gives the size and delivery card grids arrow/Home/End roving with selection-follows-focus, and exactly one option tabbable — including the nothing-checked-yet case. With `aria-checked` on buttons and `aria-hidden` on the check icons, selection is never conveyed by the yellow fill alone. That satisfies PRODUCT.md's "never by color alone" commitment for real. The static sweep backs this up: **zero** unlabeled images, **zero** click-handlers on non-interactive elements, and a global `prefers-reduced-motion` guard at `globals.css:710` plus six scoped ones.

**3. Progressive disclosure that doubles as a performance decision.** The ~100 kB InPost SDK is injected only when the dialog opens and cached at module scope, with the failure path nulling the promise so a retry works instead of caching the failure forever (`parcel-locker-map-dialog.tsx:24-54`). The calendar snaps to the first *actually available* month rather than today's, with a guard so a visitor who has already paged around is never yanked back. Both are invisible when they work — which is the point.

## Priority Issues

### [P0] The parcel-locker map is unreachable by keyboard

`useDialogChrome` builds its focus trap with `containerRef.current.querySelectorAll(...)` (`use-dialog-chrome.ts:19-24`). `querySelectorAll` does not pierce shadow DOM, and the InPost geowidget renders its search field and pins inside a shadow root. The only light-DOM focusable in that dialog is the close button — so `firstElement === lastElement === closeButton`. Every Tab hits the `activeElement === lastElement` branch at `use-dialog-chrome.ts:51-54`, gets `preventDefault`ed, and returns focus to the close button. **A keyboard user can open the map and can never enter it.**

**Why it matters:** PRODUCT.md commits that configuration works by keyboard. Most Polish buyers don't know their paczkomat code from memory — the map *is* how you find it. The manual-entry fallback requires exactly the knowledge the map was supposed to supply.

**Fix:** Detect a shadow-DOM host (`containerRef.current.querySelector('inpost-geowidget')`) and skip the Tab trap for that dialog, applying `inert` to everything outside the dialog root instead. `inert` traps focus at the platform level and handles shadow DOM correctly — and it simultaneously fixes the missing background-hiding for all four dialogs.

**Suggested command:** `/impeccable harden`

### [P1] There is no order total, anywhere, ever

The sticky bar shows `Rozmiar: 60 cm · 249 zł`, `Termin: …`, `Dostawa: Paczkomat InPost · 17 zł` (`page.tsx:651-670`) — three numbers, never summed, in `text-xs`. Meanwhile decorative per-size prices are `text-lg` and the custom estimate is `text-2xl`. The anti-slip dialog then asks for +39 zł against a base the customer has never seen. The first total appears on Stripe's own page, after the redirect. On the quote path, never.

**Why it matters:** Violates Product Principle 4 outright. On a conversion-critical surface, the last thing before "Zapłać" must be one unambiguous number. Forcing mental arithmetic across a 12px line and then stacking an upsell on top is the classic abandon-here moment. It's also the strongest available proof that this maker is transparent — and it's missing.

**Fix:** Replace the three-fact strip with an itemised block plus **Razem** in `text-xl font-black`. Move the anti-slip offer inline into Panel 1 or 2 as a checkbox that updates the total live, and delete `AntiSlipOfferDialog` — the interstitial buys 39 zł at the price of interrupting the highest-intent click on the site.

**Suggested command:** `/impeccable layout`

### [P1] Nothing survives an interruption

All order state is plain `useState` (`page.tsx:155-189`) plus a `File` in memory. No sessionStorage, no URL state, no draft. A refresh, an incoming call, a back-swipe, or browser-back from Stripe (`window.location.href` at `page.tsx:330`, so back is a full reload) wipes size, date, delivery method, paczkomat code, full address, name, email, phone, notes, and the uploaded photo. `/zamow/anulowano` then returns the user to the *variant list*, not their half-filled order.

**Why it matters:** The modal user arrives from an Instagram reel, one-handed, interruptible. The quote path asks for ~11 fields before yielding anything. Losing all of it to a phone call is a total abandon.

**Fix:** Persist `booking` to sessionStorage on change (debounced), keyed by rug id + variant, and rehydrate on mount. Persist the image as a data URL or drop only that field with an explicit "dodaj zdjęcie ponownie" note. Deep-link the `anulowano` CTA back to `/zamow/{id}?variant=…`.

**Suggested command:** `/impeccable harden`

### [P1] The quote path ends with no receipt of any kind

`createContactBooking` returns `{ success, bookingId, notificationSent }` (`actions.ts:462-466`). `page.tsx:334-348` destructures only `success` and throws `bookingId` away. `ContactSuccessDialog` shows no reference number, no summary of what was submitted, and no email is sent to the customer — only a WhatsApp to the owner (`actions.ts:452`).

**Why it matters:** The customer is told to go start an Instagram conversation about an order they cannot identify and hold no proof of. For a first-time commissioner, "I filled in a form and was told to DM someone" is indistinguishable from the form having failed. It also creates support load: the owner receives DMs he cannot match to bookings.

Structurally, this is the deeper problem: **both paths run the identical form.** Same delivery radios, same paczkomat code, same full postal address, same calendar — so the quote path reads as "you completed a checkout and were denied a purchase." Asking for a house number before any price exists is backwards. The framing copy is right; the *shape* of the form contradicts it.

**Fix:** Surface `bookingId` as `Zgłoszenie #{id}` with a copy button, echo the submitted details beneath it, and send a confirmation email — `lib/order-confirmation-email.ts` already exists. Then trim the quote path to idea + dimensions + notes + photo + contact, deferring address and paczkomat code until after the price is agreed.

**Suggested command:** `/impeccable onboard`

### [P1] No legal, help, or contact route anywhere in checkout

The configurator renders header → hero → gallery → form → sticky bar. **No footer.** `/regulamin`, `/zwroty` and `/polityka-prywatnosci` all exist under `app/(public)/` and are linked from nowhere in the order flow. No FAQ, no delivery terms, no way to reach the maker before submitting.

**Why it matters:** Three failures at once. DESIGN.md's build mandate explicitly requires *"a proper footer"* on every public page. Heuristic 10 scores 1/4 almost entirely because of this. And a made-to-order rug is exempt from Poland's 14-day consumer withdrawal right — the buyer must be told *before* paying, and currently never is. The first-time buyer's most likely pre-payment question, "what if I don't like it?", has no answer on screen.

**Fix:** Add a compact checkout footer with Regulamin / Zwroty / Polityka prywatności / Instagram. Add one line above the submit button: *"Zamawiasz rzecz robioną na Twoje zamówienie — sprawdź, jak wtedy działają zwroty."* linking to `/zwroty`.

**Suggested command:** `/impeccable clarify`

### [P1] The layout breaks at 320px and the sticky bar fights the form

Three separate browser-verified layout defects, none visible from reading source:

- **320px: 66px horizontal overflow** (`scrollWidth 386` vs `clientWidth 320`). The calendar's Sunday ("Nie") column is clipped off the right edge — a required control, unreachable. react-day-picker renders 42px day cells → a fixed 294px grid; `date-picker.tsx:36-38` sets the month grid to `width: 100%` but never shrinks the cells.
- **Desktop: the sticky bar occludes Panel 1.** At `z-20` it covers the calendar helper text explaining that blocked days are struck through — the one sentence that makes disabled days comprehensible.
- **Mobile: the sticky CTA is absent for the first ~1.5 screens.** Page height is 4084px at 390px wide; the bar's containing block is the `<form>`, which begins below the hero and the 5-photo gallery, so the summary and primary action simply aren't there until you scroll into the form.

**Fix:** Make day cells `min-w-0` with a percentage basis so the grid shrinks below 366px. Add bottom padding to the form equal to the sticky bar's height, or reduce its `z-index` below the panels. Move `CategoryRealizations` below the form — it re-opens a browsing decision the visitor has already made, on a surface whose job is completion.

**Suggested command:** `/impeccable adapt`

## Persona Red Flags

**Sam (screen reader + keyboard-only):** Parcel-locker map fully unreachable (P0); the widget host div carries no accessible name or role. The reference-image input has **no label, no `aria-label`, no `id`** — confirmed in the live DOM audit, where 6 of 7 fields resolve via a wrapping `<label>` and the file input resolves to **none** (`reference-image-upload.tsx:63`). Its error is a plain `<p>` with no `role="alert"` — pick a 12 MB file and hear nothing. The `aria-live` region is created in the same commit as its content (`page.tsx:646`), so a 5 MB upload announces nothing. Focus is dropped at the payment moment: the anti-slip dialog restores focus to the submit button that `page.tsx:689` has just disabled, so focus falls to `<body>` as the Stripe redirect fires. The date-picker error target (`date-picker.tsx:139-151`) is a nameless `tabIndex={-1}` div with `outline-none` and **no replacement focus indicator** — `focusFirstInvalidField` sends a keyboard user there with no visible or announced cue. Blocked days are correctly struck through rather than color-only, but being `disabled` they're unfocusable, so Sam can't discover which days are gone or why. **25 elements measure under 44px** in the live DOM: the 36px wordmark and "Zmień wariant" links, the 36px calendar nav arrows, and 21 × 42px day buttons — all pass WCAG 2.2's 24px floor, all fail DESIGN.md's own stated 44px rule. Every *primary* action correctly uses `min-h-12`.

**Casey (one-handed phone, interrupted):** Total state loss on interruption is the headline risk (P1). The sticky bar's thumb-zone placement is genuinely good — but it's missing for the first 1.5 screens, and it self-destructs into the error list exactly when re-reading the summary matters. The upsell dialog uses `flex-col-reverse` on mobile, putting **"Chcę (+39 zł)" above "Nie, dzięki"** — the accept option lands in the natural thumb arc of a dialog she never asked for. `autoComplete="off"` on the paczkomat code blocks her phone's suggestions on the one field with a memorable format, and hand-typing a code silently clears the map-supplied address mid-keystroke (`delivery-picker.tsx:240-243`) with no explanation. A 5 MB upload shows no progress and offers no cancel — 30+ seconds of an apparently frozen page on 3G.

**Riley (stress tester):** **0 available dates → silent dead end** — the calendar opens on an all-struck-through month, `startMonth` blocks paging back, there's no `endMonth` and no empty state; page forward forever, learn nothing. **Unknown rug id → a fully functional doomed configurator**: `.single()` fails, `rugType` stays null, but `isDirectCheckout` defaults to **`true`** (`page.tsx:236`), so you get a "Zapłać i zarezerwuj" flow titled `Wariant #999` and only find out at submit. No `notFound()`. `?variant=999` on papadywany produces self-contradicting UI — "Wybierz podrodzaj" and "Wybrany podrodzaj: {name}" on screen simultaneously. A renamed `.pdf` passes the client `file.type` check and is rejected by the real magic-byte check *after* pressing pay. Each retry re-uploads and burns the rate limit until lockout, orphaning files. Racing a blocked date returns a message into `submitMessage` but never populates `fieldErrors.pickupDate`, so nothing scrolls, nothing focuses, and the message can sit screens away from the calendar it refers to. Server internals leak verbatim: "Nie udało się ustalić adresu powrotu po płatności", "Wybrany rozmiar nie należy do tego wariantu dywanu". Double-submit, by contrast, is correctly guarded in both paths.

**Marta (project-specific: first-time commissioner, arrived from an Instagram reel):** She cannot picture the product — "60 cm" plus a footnote is the entire size affordance for an object whose whole value is how it sits on her floor. She gets three contradictory statements about time: "rezerwujesz termin", "to dzień, w którym zaczynam pracę", and a lead time in a third place, never added together — so she doesn't know when the rug arrives, the single most important fact for a first-time buyer. "Podrodzaj" is never defined, and her choice is echoed as bare text with no image, though `SubcategoryCard` had a cover photo two screens earlier. Her idea — the photo the entire rug is based on — disappears into 14px of filename. And there is **no maker on screen**: no face, no name, no 10k-follower fact, nowhere in the flow where she decides to trust a stranger with 300–800 zł. She came from an Instagram account with a face and a workshop; the configurator has neither.

## Minor Observations

- **Brand-voice violations.** `page.tsx:636` says *"Zanim **ruszymy** dalej"* — first-person plural, which PRODUCT.md forbids. Worse, the same fact is stated two ways ~170 lines apart and both are visible at once: *"cenę i płatność **ustalimy**"* (`page.tsx:514`) vs *"cenę i płatność **ustalę** z Tobą"* (`page.tsx:681`).
- **Jargon aimed at first-timers.** "Materiał referencyjny" (`page.tsx:619`) is administrative language for *her photo* — try *"Zdjęcie, z którego zrobię dywan."* "Wariant" means rug *type* in the header and *subrodzaj* in `actions.ts:203`; pick one word per concept.
- **Error messages that name the problem but not the fix:** `actions.ts:107`, `:84`, `:91`, `:345`, `:136`, `:224`, `:235`, `:203`, and the content-free fallback "Nieprawidłowe dane." The model to copy already exists in this codebase: *"Nie udało się wczytać mapy InPost. Zamknij to okno i wpisz kod paczkomatu ręcznie."* (`parcel-locker-map-dialog.tsx:193`) — problem **and** exact fix.
- **`low-contrast` at 4.2:1** — the "Zamówienie" kicker, `#2864f0` on `#dcecff` (`page.tsx:494`). Needs 4.5:1. Darken the cobalt or drop the soft-blue chip behind it.
- **Price formatting diverges.** `size-picker.tsx:484` renders `{Number(size.price_cents)/100} zł` raw; a non-integer prints `249.5 zł` — a decimal *point*, in Polish, where everything else uses `Intl` with a comma and non-breaking space.
- **`formatPriceCents(null)` returns a full sentence** (`lib/custom-rug-price.ts:51`) from a function named like a formatter. Works today; a trap for the next caller.
- **Free delivery computed from an estimate.** `page.tsx:408-414` feeds `customPriceCents` into `calculateDeliveryCostCents`, so "Dostawa gratis" can be promised against a price that hasn't been agreed.
- **Panel 3 contradicts the layout** — *"Na końcu dodaj zdjęcie"* on a page where all three panels are simultaneously visible and editable. The 1/2/3 badges promise a wizard the layout doesn't deliver.
- **Focus ring contrast:** `field-error.tsx:30` rings with `--ruggy-blue-soft` (#dcecff) on #fffaf0 — roughly 1.2:1, well under the 3:1 a focus indicator needs. The cobalt border change carries the real signal, so it passes in practice, but the 4px ring is decorative.
- **One hardcoded color** in an otherwise fully tokenised surface: `shadow-[0_14px_40px_rgba(31,26,22,0.18)]` at `page.tsx:629`; `rgb(31,26,22)` matches no token (`--ruggy-ink` is #142033).
- **Two dialogs can stack** on papadywany (`ContentWarningGate` + `AntiSlipOfferDialog`), each attaching a window keydown listener and each writing `document.body.style.overflow` — unmount order decides what gets restored.
- **`ContentWarningGate` paints late.** `getServerSnapshot` returns `true` (`content-warning-gate.tsx:37`), so the page renders fully and the warning drops on top of content it was meant to precede.
- **Next.js warns** the LCP image should use `loading="eager"`.

## Questions to Consider

1. **Why does the quote path ask for a postal address before a price exists?** If you deleted delivery and date from the non-checkout flow — leaving idea, dimensions, notes, photo, contact — would it stop feeling like a checkout that failed and start feeling like the more personal service it actually is?
2. **The anti-slip mat earns 39 zł by interrupting the highest-intent click on the site.** What's the conversion cost of that interstitial versus the same offer as an inline checkbox next to a live total? Would you take that trade if it costs one order in fifty?
3. **The reference photo is the product, and it's step 3, optional, and rendered as a filename.** What happens if it becomes step 1 — *"pokaż mi swój pomysł"* — with a real preview, and size/date/delivery become the consequences of that idea rather than the gate in front of it?
4. **Marta can't tell how big 60 cm is.** What's the cheapest thing that would tell her — a silhouette, a "mniej więcej jak…" comparison, a photo of that size in a real room? And why is that a footnote when the price is `text-lg`?
5. **The positioning is "kontakt z konkretnym twórcą," and the maker appears nowhere on the screen where money changes hands.** If you put his face, his name and the 10k-follower fact directly above the submit button, does the "Bezpieczna płatność online" padlock become redundant — or does the real trust signal for this product turn out to be a person rather than a padlock?
