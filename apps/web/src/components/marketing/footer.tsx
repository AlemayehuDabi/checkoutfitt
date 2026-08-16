import * as React from "react";
import Link from "next/link";

/** Inline marks — the CSP blocks external assets and these are trivial. */
function XMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64Z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 5.68a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32Zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.3-7.02a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0Z" />
    </svg>
  );
}

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Sign up", href: "/sign-up" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#features" },
      { label: "Careers", href: "/#features" },
      { label: "Press", href: "/#features" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/#pricing" },
      { label: "Terms", href: "/#pricing" },
      { label: "Cookies", href: "/#pricing" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      <div className="mx-auto w-full max-w-[1200px] px-lg py-5xl sm:px-3xl">
        <div className="grid gap-4xl md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link
              href="/"
              className="rounded-sm text-h3 tracking-[-0.4px] text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              CheckoutFitt
            </Link>
            <p className="mt-md max-w-[34ch] text-body text-text-secondary">
              An AI stylist that works from the clothes you already own.
            </p>
            <div className="mt-lg flex items-center gap-sm">
              {[
                { label: "CheckoutFitt on X", href: "https://x.com/checkoutfitt", Mark: XMark },
                {
                  label: "CheckoutFitt on Instagram",
                  href: "https://instagram.com/checkoutfitt",
                  Mark: InstagramMark,
                },
              ].map(({ label, href, Mark }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <Mark />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-eyebrow uppercase text-text-muted">
                {column.heading}
              </p>
              <ul className="mt-lg flex flex-col gap-md">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-body text-text-secondary transition-colors hover:text-text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-5xl flex flex-wrap items-center justify-between gap-md border-t border-border pt-xl">
          <p className="text-caption text-text-muted">
            © {new Date().getFullYear()} CheckoutFitt. All rights reserved.
          </p>
          <p className="text-caption text-text-muted">Made for people with too many clothes.</p>
        </div>
      </div>
    </footer>
  );
}
