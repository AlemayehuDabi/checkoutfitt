"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const LINKS = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "pricing", label: "Pricing" },
];

/** Scoped smooth scroll — the app itself shouldn't get global smooth scrolling. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
}

export function NavBar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function go(id: string) {
    setMenuOpen(false);
    scrollToSection(id);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        scrolled
          ? "border-b border-border bg-surface/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-lg px-lg sm:px-3xl">
        <Link
          href="/"
          className="rounded-sm text-h3 tracking-[-0.4px] text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          CheckoutFitt
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-2xl md:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => go(link.id)}
              className="cursor-pointer rounded-sm text-body-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-md md:flex">
          <ButtonLink href="/sign-in" variant="ghost" size="sm">
            Log in
          </ButtonLink>
          <ButtonLink href="/sign-up" size="sm">
            Get started
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:hidden"
        >
          {menuOpen ? (
            <X aria-hidden className="size-5" />
          ) : (
            <Menu aria-hidden className="size-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-border bg-surface md:hidden"
          >
            <div className="flex flex-col gap-sm px-lg py-lg">
              {LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => go(link.id)}
                  className="cursor-pointer rounded-md px-md py-2 text-left text-body-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-sm flex flex-col gap-sm">
                <ButtonLink href="/sign-in" variant="outline" fullWidth>
                  Log in
                </ButtonLink>
                <ButtonLink href="/sign-up" fullWidth>
                  Get started free
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
