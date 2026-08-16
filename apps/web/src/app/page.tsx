import Link from "next/link";

/** Placeholder — the marketing landing page replaces this in Phase B. */
export default function RootPlaceholder() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-lg">
      <p className="text-eyebrow uppercase text-text-muted">CheckoutFitt</p>
      <h1 className="mt-sm text-display text-text-primary">
        Landing page coming next.
      </h1>
      <Link
        href="/dashboard"
        className="mt-2xl inline-flex h-11 w-fit items-center rounded-lg bg-primary-500 px-6 text-body-semibold text-text-on-primary shadow-primary"
      >
        Go to dashboard
      </Link>
    </main>
  );
}
