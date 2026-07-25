import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LegalDocumentPageProps {
  title: string;
  content: string;
}

const legalLinks = [
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/zwroty", label: "Zwroty" },
  { href: "/regulamin", label: "Regulamin" },
];

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]";
const focusLightClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

type LegalSection = {
  id: string;
  heading: string | null;
  blocks: LegalBlock[];
};

// Legal copy arrives as a flat string: "§N. Title" lines start sections, every
// other line is a paragraph, and clause runs ending in ";" are enumerated
// lists. Parsing it into real structure gives headings to navigate by, lists a
// screen reader can announce, and a scannable page instead of one wall of text.
const HEADING_PATTERN = /^§\s*(\d+)\.?\s+.*$/;
const STARTS_LOWERCASE = /^[a-ząćęłńóśźż]/;

function parseLegalContent(content: string): LegalSection[] {
  const sections: LegalSection[] = [];
  let current: LegalSection = { id: "wstep", heading: null, blocks: [] };
  let openList: Extract<LegalBlock, { type: "list" }> | null = null;
  let listAcceptsContinuation = false;

  const commitSection = () => {
    if (current.heading !== null || current.blocks.length > 0) {
      sections.push(current);
    }
  };

  for (const rawLine of content.trim().split("\n")) {
    const line = rawLine.trim();
    const headingMatch = line.match(HEADING_PATTERN);

    if (headingMatch) {
      commitSection();
      current = { id: `sekcja-${headingMatch[1]}`, heading: line, blocks: [] };
      openList = null;
      listAcceptsContinuation = false;
      continue;
    }

    if (!line) {
      openList = null;
      listAcceptsContinuation = false;
      continue;
    }

    const endsWithSemicolon = line.endsWith(";");
    const isListItem =
      endsWithSemicolon ||
      (listAcceptsContinuation && STARTS_LOWERCASE.test(line));

    if (isListItem) {
      if (!openList) {
        openList = { type: "list", items: [] };
        current.blocks.push(openList);
      }
      openList.items.push(line);
      // The clause that closes a list ends in "." — keep accepting only while
      // items still end in ";".
      listAcceptsContinuation = endsWithSemicolon;
    } else {
      openList = null;
      listAcceptsContinuation = false;
      current.blocks.push({ type: "paragraph", text: line });
    }
  }

  commitSection();
  return sections;
}

export function LegalDocumentPage({
  title,
  content,
}: LegalDocumentPageProps) {
  const sections = parseLegalContent(content);
  const tableOfContents = sections.filter(
    (section): section is LegalSection & { heading: string } =>
      section.heading !== null,
  );

  return (
    <div className="flex min-h-screen flex-col bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      <header className="border-b border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)]">
        <nav
          aria-label="Nawigacja dokumentów"
          className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10"
        >
          <Link href="/" className={`ruggy-wordmark text-4xl ${focusClass}`}>
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[var(--ruggy-ink)] px-5 text-sm font-black transition-colors hover:bg-[var(--ruggy-yellow)] ${focusClass}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Wróć na stronę
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">
          Informacje prawne
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
          {title}
        </h1>

        {tableOfContents.length > 1 ? (
          <nav
            aria-label="Spis treści"
            className="mt-8 rounded-2xl border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-5 sm:p-6"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--ruggy-muted)]">
              Spis treści
            </p>
            <ol className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {tableOfContents.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`text-sm font-bold text-[var(--ruggy-body)] underline decoration-[var(--ruggy-border-strong)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--ruggy-blue)] hover:decoration-[var(--ruggy-blue)] ${focusClass}`}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <article className="mt-8 space-y-10 border-y-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] py-8 sm:py-12">
          {sections.map((section, sectionIndex) => (
            <section
              key={section.heading ? section.id : `wstep-${sectionIndex}`}
              id={section.heading ? section.id : undefined}
              className="max-w-[70ch] scroll-mt-8 space-y-4"
            >
              {section.heading ? (
                <h2 className="text-xl font-black leading-snug text-[var(--ruggy-ink)] sm:text-2xl">
                  {section.heading}
                </h2>
              ) : null}
              {section.blocks.map((block, blockIndex) =>
                block.type === "paragraph" ? (
                  <p
                    key={blockIndex}
                    className="text-base leading-8 text-[var(--ruggy-body)] sm:text-[1.05rem]"
                  >
                    {block.text}
                  </p>
                ) : (
                  <ul key={blockIndex} className="space-y-2.5">
                    {block.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex gap-3 text-base leading-8 text-[var(--ruggy-body)] sm:text-[1.05rem]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-3 size-1.5 shrink-0 rounded-full bg-[var(--ruggy-blue)]"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </article>

        <nav
          aria-label="Pozostałe dokumenty"
          className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`underline decoration-2 underline-offset-4 transition-colors hover:text-[var(--ruggy-blue)] ${focusClass}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </main>

      <footer className="bg-[var(--ruggy-ink)] px-5 py-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Ruggy. Wszystkie prawa zastrzeżone.</span>
          <Link
            href="/"
            className={`font-bold transition-colors hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
          >
            Strona główna
          </Link>
        </div>
      </footer>
    </div>
  );
}
