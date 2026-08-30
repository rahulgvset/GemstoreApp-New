import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import BraceletVisual from "@/components/BraceletVisual";
import { ZODIAC_MAP } from "@/data/zodiac";

export default function ProductCard({ product }: { product: Product }) {
  const sign = ZODIAC_MAP[product.zodiacSignIds[0]];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] transition hover:shadow-lg hover:shadow-black/5"
    >
      <div className="flex items-center justify-center bg-[var(--color-cream)] py-8">
        <BraceletVisual gemstoneIds={product.gemstoneIds} size="md" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-gold)]">
          {sign?.symbol} {sign?.name}
        </span>
        <h3 className="font-display text-lg text-[var(--color-ink)] group-hover:text-[var(--color-plum)]">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--color-ink)]/60">{product.shortDescription}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-[var(--color-ink)]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-[var(--color-ink)]/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
