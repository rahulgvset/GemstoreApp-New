"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { formatPrice, calculateShipping } from "@/lib/format";
import { buildOrder, saveLastOrder } from "@/lib/orders";
import { CustomerInfo } from "@/lib/types";

const initialForm: CustomerInfo = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function CheckoutPage() {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<CustomerInfo>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const items = lines
    .map((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      return product ? { product, quantity: line.quantity } : null;
    })
    .filter((x): x is { product: (typeof PRODUCTS)[number]; quantity: number } => x !== null);

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-[var(--color-ink)]">
          Nothing to check out yet
        </h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Add a bracelet to your cart before checking out.
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const order = buildOrder(lines, form, subtotal, shipping);
    saveLastOrder(order);
    clearCart();
    router.push("/checkout/confirmation");
  };

  const updateField = (field: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl text-[var(--color-ink)] sm:text-4xl">Checkout</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:col-span-2">
          <h2 className="font-display text-lg text-[var(--color-ink)]">Shipping Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
              Full name
              <input
                required
                type="text"
                value={form.fullName}
                onChange={updateField("fullName")}
                className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={updateField("email")}
                className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
            Street address
            <input
              required
              type="text"
              value={form.address}
              onChange={updateField("address")}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
              City
              <input
                required
                type="text"
                value={form.city}
                onChange={updateField("city")}
                className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
              Postal code
              <input
                required
                type="text"
                value={form.postalCode}
                onChange={updateField("postalCode")}
                className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
              Country
              <input
                required
                type="text"
                value={form.country}
                onChange={updateField("country")}
                className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-cream)] p-4 text-xs text-[var(--color-ink)]/60">
            This is a demo checkout — no payment will be charged. Order details
            are stored locally in your browser only.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-[var(--color-plum)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-plum-dark)] disabled:opacity-60"
          >
            Place Order
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-display text-lg text-[var(--color-ink)]">Order Summary</h2>
          <div className="mt-4 flex flex-col gap-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm text-[var(--color-ink)]/70">
                <span>
                  {product.name} × {quantity}
                </span>
                <span>{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-ink)]/70">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-[var(--color-ink)]/70">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-[var(--color-border)] pt-4 font-semibold text-[var(--color-ink)]">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
