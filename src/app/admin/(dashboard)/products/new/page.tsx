import { getAllGemstones, getAllZodiacSigns } from "@/lib/catalog";
import { createProduct } from "@/app/admin/(dashboard)/products/actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const [gemstones, zodiacSigns] = await Promise.all([
    getAllGemstones(),
    getAllZodiacSigns(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl text-[var(--color-ink)]">Add Product</h1>
      <p className="mt-1 text-sm text-[var(--color-ink)]/60">
        Create a new bracelet and assign it to zodiac signs and gemstones.
      </p>

      <div className="mt-8">
        <ProductForm
          action={createProduct}
          gemstones={gemstones}
          zodiacSigns={zodiacSigns}
          submitLabel="Create Product"
        />
      </div>
    </div>
  );
}
