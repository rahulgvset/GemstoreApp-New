import Link from "next/link";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { getFeaturedProducts } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-plum)] to-[var(--color-plum-dark)] text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
          <span className="text-sm uppercase tracking-[0.3em] text-[var(--color-gold-light)]">
            Astrology-Inspired Jewelry
          </span>
          <h1 className="font-display text-4xl leading-tight sm:text-6xl">
            Wear the wisdom of the stars
          </h1>
          <p className="max-w-xl text-base text-white/80 sm:text-lg">
            Handcrafted gemstone bracelets curated for each zodiac sign —
            designed to align with your energy, your intentions, and your story.
          </p>
          <Link
            href="/collections"
            className="mt-2 rounded-full bg-[var(--color-gold)] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-gold-light)]"
          >
            Shop Your Sign
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl text-[var(--color-ink)] sm:text-3xl">
          Shop by Zodiac Sign
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink)]/60">
          Every collection is matched with gemstones traditionally associated
          with that sign&apos;s ruling planet and element.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {ZODIAC_SIGNS.map((sign) => (
            <Link
              key={sign.id}
              href={`/collections/${sign.id}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-6 text-center transition hover:border-[var(--color-gold)] hover:shadow-md"
            >
              <span className="text-3xl text-[var(--color-plum)]">{sign.symbol}</span>
              <span className="font-display text-sm text-[var(--color-ink)]">{sign.name}</span>
              <span className="text-xs text-[var(--color-ink)]/50">{sign.dateRange}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-card)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl text-[var(--color-ink)] sm:text-3xl">
              Best Sellers
            </h2>
            <Link
              href="/collections"
              className="text-sm font-medium text-[var(--color-plum)] hover:text-[var(--color-gold)]"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { title: "Ethically Sourced", body: "Genuine gemstones, sourced with care and transparency." },
            { title: "Hand-Strung", body: "Each bracelet is assembled by hand and quality-checked." },
            { title: "Astrology-Matched", body: "Curated stone combinations rooted in astrological tradition." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="font-display text-lg text-[var(--color-plum)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink)]/60">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
