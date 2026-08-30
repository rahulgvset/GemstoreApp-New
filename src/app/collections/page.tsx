import Link from "next/link";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { getProductsBySign } from "@/data/products";

export const metadata = {
  title: "Collections | Celestine Stones",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-[var(--color-ink)] sm:text-4xl">
        All Collections
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink)]/60">
        Browse gemstone bracelets by zodiac sign. Each collection features
        stones chosen for that sign&apos;s element and ruling planet.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ZODIAC_SIGNS.map((sign) => {
          const count = getProductsBySign(sign.id).length;
          return (
            <Link
              key={sign.id}
              href={`/collections/${sign.id}`}
              className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition hover:border-[var(--color-gold)] hover:shadow-md"
            >
              <span className="text-4xl text-[var(--color-plum)]">{sign.symbol}</span>
              <div>
                <h2 className="font-display text-lg text-[var(--color-ink)]">{sign.name}</h2>
                <p className="text-xs text-[var(--color-ink)]/50">{sign.dateRange}</p>
                <p className="mt-1 text-xs font-medium text-[var(--color-gold)]">
                  {count} bracelet{count === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
