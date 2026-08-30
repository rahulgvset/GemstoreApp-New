"use client";

import { Gemstone, ZodiacInfo } from "@/lib/types";

export interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  shortDescription: string;
  description: string;
  beadSizeMm: number;
  stock: number;
  featured: boolean;
  gemstoneIds: string[];
  zodiacSignIds: string[];
}

export default function ProductForm({
  action,
  gemstones,
  zodiacSigns,
  initialValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  gemstones: Gemstone[];
  zodiacSigns: ZodiacInfo[];
  initialValues?: Partial<ProductFormValues>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
          Product name
          <input
            required
            name="name"
            defaultValue={initialValues?.name}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
          Slug (URL) — leave blank to auto-generate from name
          <input
            name="slug"
            defaultValue={initialValues?.slug}
            placeholder="leo-classic-bracelet"
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
          Price (USD)
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="price"
            defaultValue={initialValues?.price}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
          Compare-at price (optional)
          <input
            type="number"
            step="0.01"
            min="0"
            name="compareAtPrice"
            defaultValue={initialValues?.compareAtPrice ?? undefined}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
          Bead size (mm)
          <input
            type="number"
            min="1"
            name="beadSizeMm"
            defaultValue={initialValues?.beadSizeMm ?? 8}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
        Short description (shown on cards)
        <input
          required
          name="shortDescription"
          defaultValue={initialValues?.shortDescription}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
        Full description
        <textarea
          required
          name="description"
          rows={4}
          defaultValue={initialValues?.description}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
          Stock quantity
          <input
            type="number"
            min="0"
            name="stock"
            defaultValue={initialValues?.stock ?? 0}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 self-end text-sm text-[var(--color-ink)]/70">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initialValues?.featured}
            className="h-4 w-4"
          />
          Featured on homepage
        </label>
      </div>

      <fieldset className="rounded-2xl border border-[var(--color-border)] p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">
          Zodiac Signs
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {zodiacSigns.map((sign) => (
            <label key={sign.id} className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
              <input
                type="checkbox"
                name="zodiacSignIds"
                value={sign.id}
                defaultChecked={initialValues?.zodiacSignIds?.includes(sign.id)}
                className="h-4 w-4"
              />
              {sign.symbol} {sign.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-[var(--color-border)] p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]/50">
          Gemstones
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {gemstones.map((stone) => (
            <label key={stone.id} className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
              <input
                type="checkbox"
                name="gemstoneIds"
                value={stone.id}
                defaultChecked={initialValues?.gemstoneIds?.includes(stone.id)}
                className="h-4 w-4"
              />
              <span
                className="h-3 w-3 flex-shrink-0 rounded-full ring-1 ring-black/10"
                style={{ background: stone.hex }}
              />
              {stone.name}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="self-start rounded-full bg-[var(--color-plum)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-plum-dark)]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
