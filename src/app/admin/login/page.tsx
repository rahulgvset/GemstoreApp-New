import { loginAction } from "@/app/admin/auth-actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect: redirectTo } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
        <h1 className="font-display text-2xl text-[var(--color-ink)]">Admin Sign In</h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">
          Manage products and collections for Celestine Stones.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid email or password.
          </p>
        )}

        <form action={loginAction} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="redirectTo" value={redirectTo ?? "/admin"} />
          <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
            Email
            <input
              required
              type="email"
              name="email"
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]/70">
            Password
            <input
              required
              type="password"
              name="password"
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-plum)] focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-full bg-[var(--color-plum)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-plum-dark)]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
