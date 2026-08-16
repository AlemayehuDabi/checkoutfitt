import Link from "next/link";

/**
 * Temporary placeholder. The home dashboard takes over this route in Phase C,
 * at which point this file is replaced by src/app/(app)/page.tsx.
 */
export default function Placeholder() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-lg py-5xl">
      <p className="text-eyebrow uppercase text-text-muted">CheckoutFitt</p>
      <h1 className="mt-sm text-display text-text-primary">
        Your closet, understood.
      </h1>
      <p className="mt-md text-body-lg text-text-secondary">
        The design system and component library are in place. The app shell,
        auth, and feature pages land in the following phases.
      </p>
      <Link
        href="/components"
        className="mt-2xl inline-flex h-11 w-fit items-center rounded-lg bg-primary-500 px-6 text-body-semibold text-text-on-primary shadow-primary transition-colors hover:bg-primary-400"
      >
        View component gallery
      </Link>
    </main>
  );
}
