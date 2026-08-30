import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminDashboardPage() {
  const products = await prisma.product.findMany({
    include: { zodiacSigns: { include: { sign: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-ink)]">Products</h1>
          <p className="text-sm text-[var(--color-ink)]/60">
            {products.length} product{products.length === 1 ? "" : "s"} in the catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[var(--color-plum)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-plum-dark)]"
        >
          + Add Product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-ink)]/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Zodiac Signs</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{product.name}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/70">
                  {product.zodiacSigns.map((z) => z.sign.name).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-[var(--color-ink)]/70">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/70">{product.stock}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]/70">{product.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs font-medium text-[var(--color-plum)] hover:text-[var(--color-gold)]"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-ink)]/50">
                  No products yet. Add your first bracelet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
