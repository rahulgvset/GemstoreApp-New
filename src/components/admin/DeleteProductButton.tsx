"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/admin/(dashboard)/products/actions";

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    startTransition(() => {
      deleteProduct(productId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
