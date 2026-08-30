export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-[var(--color-ink)]/70 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg text-[var(--color-plum)]">✦ Celestine Stones</p>
          <p>Handcrafted gemstone bracelets, curated by the stars.</p>
        </div>
        <p className="mt-6 text-xs text-[var(--color-ink)]/50">
          © {new Date().getFullYear()} Celestine Stones. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
