"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SiteHeader() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-cream)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-wide text-[var(--color-plum)]">
          ✦ Celestine Stones
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--color-ink)] sm:flex">
          <Link href="/" className="hover:text-[var(--color-gold)]">
            Home
          </Link>
          <Link href="/collections" className="hover:text-[var(--color-gold)]">
            Collections
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-full border border-[var(--color-plum)] px-4 py-2 text-sm font-medium text-[var(--color-plum)] transition hover:bg-[var(--color-plum)] hover:text-white"
        >
          Cart
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-gold)] px-1 text-xs font-semibold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
