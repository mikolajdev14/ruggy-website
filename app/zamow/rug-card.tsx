import Image from "next/image";
import Link from "next/link";
import rugDog from "@/public/ruggy/rug-dog.webp";
import rugVinyl from "@/public/ruggy/rug-vinyl.webp";

interface RugProps {
  id: number | string;
  name: string;
  description: string;
  leadDays: number;
}

export const RugCard = (props: RugProps) => {
  const image = Number(props.id) % 2 === 0 ? rugVinyl : rugDog;

  return (
    <Link
      href={`/zamow/${props.id}`}
      className="group block h-full overflow-hidden rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] shadow-[5px_6px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ruggy-blue-soft)]">
        <Image
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={image}
          alt={props.name}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute start-4 top-4 rounded-full border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] px-3 py-1.5 text-xs font-black text-[var(--ruggy-ink)]">
          {props.leadDays} dni realizacji
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-black tracking-tight text-[var(--ruggy-ink)]">
            {props.name}
          </h2>
          <span className="mt-1 text-sm font-black text-[var(--ruggy-blue)] transition-transform group-hover:translate-x-1">
            Wybierz →
          </span>
        </div>

        <p className="mt-3 line-clamp-3 text-base leading-7 text-[var(--ruggy-body)]">
          {props.description}
        </p>
      </div>
    </Link>
  );
};
