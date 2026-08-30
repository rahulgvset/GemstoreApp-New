"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";
import { readLastOrder } from "@/lib/orders";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const { catalog } = useCart();

  useEffect(() => {
    setOrder(readLastOrder());
  }, []);

  if (order === undefined) {
    return null;
  }

  if (order === null) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-[var(--color-ink)]">No recent order found</h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Looks like you haven&apos;t placed an order yet.
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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-5xl">✦</span>
        <h1 className="font-display text-3xl text-[var(--color-ink)] sm:text-4xl">
          Thank you, {order.customer.fullName.split(" ")[0] || "friend"}!
        </h1>
        <p className="text-sm text-[var(--color-ink)]/60">
          Your order <span className="font-semibold text-[var(--color-plum)]">{order.id}</span>{" "}
          has been placed.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="font-display text-lg text-[var(--color-ink)]">Order Details</h2>
        <div className="mt-4 flex flex-col gap-3">
          {order.lines.map((line) => {
            const product = catalog.find((p) => p.id === line.productId);
            if (!product) return null;
            return (
              <div key={line.productId} className="flex justify-between text-sm text-[var(--color-ink)]/70">
                <span>
                  {product.name} × {line.quantity}
                </span>
                <span>{formatPrice(product.price * line.quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-ink)]/70">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-[var(--color-ink)]/70">
          <span>Shipping</span>
          <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-[var(--color-border)] pt-4 font-semibold text-[var(--color-ink)]">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--color-border)] p-6 text-sm text-[var(--color-ink)]/70">
        <h2 className="font-display text-lg text-[var(--color-ink)]">Shipping To</h2>
        <p className="mt-2">{order.customer.fullName}</p>
        <p>{order.customer.address}</p>
        <p>
          {order.customer.city}, {order.customer.postalCode}
        </p>
        <p>{order.customer.country}</p>
        <p className="mt-2 text-[var(--color-ink)]/50">{order.customer.email}</p>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/collections"
          className="rounded-full bg-[var(--color-plum)] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-plum-dark)]"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
