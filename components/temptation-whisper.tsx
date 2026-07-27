// Diabełek na ramieniu — the ghost marquee drifting behind the masthead
// headline, in place of the single repeated word that used to sit there. Purely
// decorative, so it is hidden from assistive tech; motion is CSS-only
// (globals.css) and stops under prefers-reduced-motion.
const TEMPTATIONS = [
  "Raz się w końcu żyje!",
  "Przecież ci się należy!",
  "Jutro i tak zarobisz.",
  "Kupujesz raz, a dobrze!",
  "Za miesiąc nie pożałujesz.",
  "Zasługujesz na odrobinę luksusu.",
  "To inwestycja, nie wydatek!",
  "Stać cię na to!",
];

export function TemptationWhisper() {
  return (
    <div
      aria-hidden="true"
      className="ruggy-whisper pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none"
    >
      {/* Two identical halves: the track slides exactly one of them, so the
          loop closes seamlessly. */}
      <div className="ruggy-whisper-track">
        {[0, 1].map((half) => (
          <div key={half} className="ruggy-whisper-half">
            {TEMPTATIONS.map((temptation) => (
              <span key={temptation}>
                {temptation}{" "}
                <span className="ruggy-whisper-devil">😈</span>{" "}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
