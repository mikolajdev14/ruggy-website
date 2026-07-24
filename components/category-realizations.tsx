import Image from "next/image";
import type { GalleryPhoto } from "@/lib/gallery";

export function CategoryRealizations({
  photos,
  categoryName,
}: {
  photos: GalleryPhoto[];
  categoryName: string;
}) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="category-realizations-title"
      className="border-b border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)]"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--ruggy-blue)]">
              {categoryName}
            </p>
            <h2
              id="category-realizations-title"
              className="mt-1 text-2xl font-black tracking-[-0.03em] sm:text-3xl"
            >
              Zobacz przykładowe realizacje
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ruggy-body)]">
            Tak wyglądają dywany z tej kategorii. Twój powstanie od nowa.
          </p>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {photos.map((photo, index) => (
            <li
              key={photo.src}
              className={index === 4 ? "col-span-2 sm:col-span-1" : undefined}
            >
              <figure className="overflow-hidden rounded-2xl border-2 border-[var(--ruggy-ink)] bg-white p-1.5 shadow-[3px_4px_0_var(--ruggy-ink)]">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
