import Link from "next/link";
import { logoutAction } from "@/app/admin/auth-actions";

export const metadata = {
  title: "Admin | Celestine Stones",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] bg-[var(--color-cream)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-plum-dark)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/admin" className="font-display text-lg">
            ✦ Admin Panel
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-white/30 px-4 py-1.5 text-xs font-medium hover:bg-white/10"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
