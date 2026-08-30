import { notFound } from "next/navigation";
import { ZODIAC_SIGNS, ZODIAC_MAP } from "@/data/zodiac";
import { getProductsBySign } from "@/lib/catalog";
import { ZodiacSignId } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((sign) => ({ sign: sign.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;
  const info = ZODIAC_MAP[sign as ZodiacSignId];
  return { title: info ? `${info.name} Bracelets | Celestine Stones` : "Collection" };
}

export default async function ZodiacCollectionPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign } = await params;
  const info = ZODIAC_MAP[sign as ZodiacSignId];

  if (!info) {
    notFound();
  }

  const products = await getProductsBySign(info.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-5xl text-[var(--color-plum)]">{info.symbol}</span>
        <h1 className="font-display text-3xl text-[var(--color-ink)] sm:text-4xl">
          {info.name} Bracelets
        </h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          {info.dateRange} · {info.element} · Ruled by {info.rulingPlanet}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {info.traits.map((trait) => (
            <span
              key={trait}
              className="rounded-full bg-[var(--color-cream)] px-3 py-1 text-xs font-medium text-[var(--color-plum)]"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
