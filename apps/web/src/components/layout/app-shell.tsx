"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { pageTransition } from "@/lib/motion";
import { SidebarContent } from "./sidebar";
import { TopBar } from "./top-bar";

/**
 * Three sidebar modes, by viewport:
 *   ≥ lg   full 260px rail, user-collapsible to 72px
 *   md–lg  always the 72px icon rail (no room for labels)
 *   < md   off-canvas drawer behind a hamburger
 *
 * The desktop `collapsed` preference is kept in state; the md–lg rail is
 * handled purely with CSS so it can't fight the user's choice.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isWide, setIsWide] = React.useState(true);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Labels only ever render at ≥lg, so the icon rail below that stays icon-only
  // regardless of the collapse preference.
  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Escape closes the drawer.
  React.useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const railCollapsed = !isWide || collapsed;

  return (
    <div className="min-h-dvh">
      {/* Desktop / tablet rail */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border shadow-[1px_0_3px_rgba(26,25,23,0.04)] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:block",
          collapsed ? "lg:w-[72px]" : "lg:w-[260px]",
          "w-[72px]",
        )}
      >
        <SidebarContent
          collapsed={railCollapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-overlay"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={reduce ? { opacity: 0 } : { x: "-100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-y-0 left-0 w-[280px] border-r border-border shadow-xl"
            >
              <SidebarContent
                collapsed={false}
                onToggleCollapsed={() => setCollapsed((v) => !v)}
                onNavigate={() => setDrawerOpen(false)}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Content column */}
      <div
        className={cn(
          "flex min-h-dvh flex-col transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "md:pl-[72px]",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]",
        )}
      >
        <TopBar onOpenMenu={() => setDrawerOpen(true)} />
        <main className="flex-1 px-lg pb-6xl sm:px-3xl">
          <div className="mx-auto w-full max-w-[90rem]">
            {/* Keyed on route so each page fades in on navigation. `mode="wait"`
                needs the exit variant, or the outgoing page just vanishes. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={reduce ? false : pageTransition.initial}
                animate={pageTransition.animate}
                exit={reduce ? { opacity: 0 } : pageTransition.exit}
                transition={pageTransition.transition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
