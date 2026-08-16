"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Info,
  LifeBuoy,
  LogOut,
  type LucideIcon,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockProfile, mockUser } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SectionHeader } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/chip";

interface Row {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  /** Rows without a destination expand in place. */
  detail?: React.ReactNode;
}

function PreferencesDetail() {
  return (
    <dl className="flex flex-col divide-y divide-border">
      {[
        ["Dresses", mockProfile.genderPresentation ?? "—"],
        ["Style preferences", mockProfile.stylePreferences.join(", ") || "—"],
        [
          "Sizes",
          [mockProfile.sizeTop, mockProfile.sizeBottom, mockProfile.sizeShoe]
            .filter(Boolean)
            .join(" · ") || "Not set",
        ],
        ["Location", mockProfile.city ?? "Not set"],
      ].map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-lg py-md">
          <dt className="text-sm text-text-muted">{label}</dt>
          <dd className="text-right text-body-medium text-text-primary capitalize">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function PrivacyDetail() {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-body text-text-secondary">
        Your closet photos are stored privately and are only used to generate
        your own outfits. They&apos;re never used to train models.
      </p>
      <div className="flex flex-wrap gap-md">
        <Button variant="outline" size="sm">
          Download my data
        </Button>
        <Button variant="danger" size="sm">
          Delete my account
        </Button>
      </div>
    </div>
  );
}

function AboutDetail() {
  return (
    <dl className="flex flex-col divide-y divide-border">
      {[
        ["Version", "1.0.0 (web)"],
        ["Signed in as", mockUser.email],
        ["Terms", "checkoutfitt.com/terms"],
        ["Privacy policy", "checkoutfitt.com/privacy"],
      ].map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-lg py-md">
          <dt className="text-sm text-text-muted">{label}</dt>
          <dd className="text-right text-body-medium text-text-primary">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

const ROWS: Row[] = [
  {
    id: "preferences",
    icon: SlidersHorizontal,
    title: "Preferences",
    description: "Style, sizes, and location",
    detail: <PreferencesDetail />,
  },
  {
    id: "subscription",
    icon: CreditCard,
    title: "Subscription",
    description: "You're on the Free plan",
    href: "/dashboard/subscription",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "What we tell you about, and when",
    href: "/dashboard/notifications",
  },
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy & data",
    description: "How your photos and data are handled",
    detail: <PrivacyDetail />,
  },
  {
    id: "support",
    icon: LifeBuoy,
    title: "Support",
    description: "Get help or send feedback",
    detail: (
      <p className="text-body text-text-secondary">
        Email{" "}
        <span className="font-[500] text-text-accent">help@checkoutfitt.com</span>{" "}
        and we&apos;ll get back to you within a day.
      </p>
    ),
  },
  {
    id: "about",
    icon: Info,
    title: "About",
    description: "Version and legal",
    detail: <AboutDetail />,
  },
];

export function SettingsList() {
  const router = useRouter();
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  return (
    <div className="mx-auto max-w-[720px] py-2xl">
      <SectionHeader
        eyebrow="Your account"
        title="Settings"
        description="Everything about how CheckoutFitt works for you."
      />

      <ul className="overflow-hidden rounded-xl border border-border bg-surface shadow-md">
        {ROWS.map((row, index) => {
          const Icon = row.icon;
          const isOpen = expanded === row.id;
          const panelId = `settings-${row.id}`;

          const inner = (
            <>
              <span
                aria-hidden
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-secondary text-primary-500"
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body-medium text-text-primary">
                  {row.title}
                </span>
                <span className="block truncate text-caption text-text-muted">
                  {row.description}
                </span>
              </span>
              {row.id === "subscription" && <Tag>Free</Tag>}
            </>
          );

          return (
            <li
              key={row.id}
              className={index > 0 ? "border-t border-border" : undefined}
            >
              {row.href ? (
                <Link
                  href={row.href}
                  className="flex items-center gap-lg px-xl py-lg transition-colors duration-200 hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
                >
                  {inner}
                  <ChevronRight aria-hidden className="size-5 shrink-0 text-text-muted" />
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpanded(isOpen ? null : row.id)}
                    className="flex w-full cursor-pointer items-center gap-lg px-xl py-lg text-left transition-colors duration-200 hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500"
                  >
                    {inner}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-5 shrink-0 text-text-muted transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border bg-surface-secondary/40 px-xl py-lg">
                          {row.detail}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-3xl">
        <Button
          variant="danger"
          iconLeft={<LogOut className="size-4" />}
          onClick={() => setLogoutOpen(true)}
        >
          Log out
        </Button>
      </div>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Log out of CheckoutFitt?"
        description="Your closet and outfits stay saved. You'll need to sign in again to get back to them."
        footer={
          <>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>
              Stay signed in
            </Button>
            <Button variant="danger" onClick={() => router.push("/sign-in")}>
              Log out
            </Button>
          </>
        }
      />
    </div>
  );
}
