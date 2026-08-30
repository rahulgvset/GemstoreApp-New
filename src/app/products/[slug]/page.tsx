import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, getProductBySlug } from "@/data/products";
import { GEMSTONE_MAP } from "@/data/gemstones";
import { ZODIAC_MAP } from "@/data/zodiac";
import { formatPrice } from "@/lib/format";
import BraceletVisual from "@/components/BraceletVisual";
import AddToCartForm from "@/components/AddToCartForm";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.name} | Celestine Stones` : "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const sign = ZODIAC_MAP[product.zodiacSignIds[0]];
  const stones = product.gemstoneIds.map((id) => GEMSTONE_MAP[id]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <nav className="mb-8 text-xs text-[var(--color-ink)]/50">
        <Link href="/collections" className="hover:text-[var(--color-gold)]">
          Collections
        </Link>{" "}
        /{" "}
        <Link href={`/collections/${sign.id}`} className="hover:text-[var(--color-gold)]">
          {sign.name}
        </Link>{" "}
        / <span>{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-3xl bg-[var(--color-cream)] py-16">
          <BraceletVisual gemstoneIds={product.gemstoneIds} size="lg" />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-gold)]">
              {sign.symbol} {sign.name} Collection
            </span>
            <h1 className="mt-1 font-display text-3xl text-[var(--color-ink)] sm:text-4xl">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-[var(--color-ink)]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-[var(--color-ink)]/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-[var(--color-ink)]/70">
            {product.description}
          </p>

          <div className="rounded-2xl border border-[var(--color-border)] p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">
              Gemstones
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {stones.map((stone) => (
                <div key={stone.id} className="flex items-center gap-3">
                  <span
                    className="h-6 w-6 flex-shrink-0 rounded-full ring-1 ring-black/10"
                    style={{ background: stone.hex }}
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-ink)]">
                      {stone.name}{" "}
                      <span className="font-normal text-[var(--color-ink)]/50">
                        · {stone.chakra} Chakra
                      </span>
                    </p>
                    <p className="text-xs text-[var(--color-ink)]/50">
                      {stone.properties.join(" · ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 text-xs text-[var(--color-ink)]/50">
            <span>Bead size: {product.beadSizeMm}mm</span>
            <span>
              {product.stock > 0 ? `In stock (${product.stock} left)` : "Out of stock"}
            </span>
          </div>

          <AddToCartForm productId={product.id} />
        </div>
      </div>
    </div>
  );
}
