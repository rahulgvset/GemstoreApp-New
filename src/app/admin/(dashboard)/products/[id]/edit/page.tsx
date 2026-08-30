import { notFound } from "next/navigation";
import { getAllGemstones, getAllZodiacSigns, getProductById } from "@/lib/catalog";
import { updateProduct } from "@/app/admin/(dashboard)/products/actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, gemstones, zodiacSigns] = await Promise.all([
    getProductById(id),
    getAllGemstones(),
    getAllZodiacSigns(),
  ]);

  if (!product) {
    notFound();
  }

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl text-[var(--color-ink)]">Edit Product</h1>
      <p className="mt-1 text-sm text-[var(--color-ink)]/60">{product.name}</p>

      <div className="mt-8">
        <ProductForm
          action={boundUpdate}
          gemstones={gemstones}
          zodiacSigns={zodiacSigns}
          initialValues={product}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
