"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartForm({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addToCart(productId, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[var(--color-ink)]">Quantity</span>
        <div className="flex items-center rounded-full border border-[var(--color-border)]">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 text-[var(--color-plum)] hover:text-[var(--color-gold)]"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="h-9 w-9 text-[var(--color-plum)] hover:text-[var(--color-gold)]"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-full bg-[var(--color-plum)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-plum-dark)]"
        >
          {justAdded ? "Added to cart ✓" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={() => {
            addToCart(productId, quantity);
            router.push("/cart");
          }}
          className="flex-1 rounded-full border border-[var(--color-plum)] px-6 py-3 text-sm font-semibold text-[var(--color-plum)] transition hover:bg-[var(--color-plum)] hover:text-white"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
