"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";
import { formatPrice, calculateShipping } from "@/lib/format";
import BraceletVisual from "@/components/BraceletVisual";

export default function CartPage() {
  const { lines, catalog, catalogLoaded, updateQuantity, removeFromCart, subtotal } = useCart();

  const items = lines
    .map((line) => {
      const product = catalog.find((p) => p.id === line.productId);
      return product ? { product, quantity: line.quantity } : null;
    })
    .filter((x): x is { product: Product; quantity: number } => x !== null);

  if (lines.length > 0 && !catalogLoaded) {
    return <div className="px-4 py-24 text-center text-sm text-[var(--color-ink)]/50">Loading your cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-[var(--color-ink)]">Your cart is empty</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Explore our zodiac collections to find your perfect bracelet.
        </p>
        <Link
          href="/collections"
          className="mt-2 rounded-full bg-[var(--color-plum)] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-plum-dark)]"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-[var(--color-ink)] sm:text-4xl">Your Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4"
            >
              <div className="flex-shrink-0">
                <BraceletVisual gemstoneIds={product.gemstoneIds} size="sm" />
              </div>
              <div className="flex-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="font-display text-base text-[var(--color-ink)] hover:text-[var(--color-plum)]"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-[var(--color-ink)]/50">{formatPrice(product.price)}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-[var(--color-border)]">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="h-8 w-8 text-[var(--color-plum)] hover:text-[var(--color-gold)]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="h-8 w-8 text-[var(--color-plum)] hover:text-[var(--color-gold)]"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="text-xs font-medium text-[var(--color-ink)]/50 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold text-[var(--color-ink)]">
                {formatPrice(product.price * quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-display text-lg text-[var(--color-ink)]">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-[var(--color-ink)]/70">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-[var(--color-ink)]/70">
            <span>Shipping</span>
            <span>{calculateShipping(subtotal) === 0 ? "Free" : formatPrice(calculateShipping(subtotal))}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-[var(--color-border)] pt-4 font-semibold text-[var(--color-ink)]">
            <span>Total</span>
            <span>{formatPrice(subtotal + calculateShipping(subtotal))}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-[var(--color-plum)] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-plum-dark)]"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
