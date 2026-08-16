"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { titleForPath } from "@/lib/navigation";
import { mockUser } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown";

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const title = titleForPath(pathname);
  const [scrolled, setScrolled] = React.useState(false);

  // The bottom border only appears once content slides under the bar.
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-lg bg-bg/85 px-lg backdrop-blur-md transition-shadow duration-200 sm:px-3xl",
        scrolled && "border-b border-border",
      )}
    >
      <IconButton
        label="Open navigation"
        className="md:hidden"
        onClick={onOpenMenu}
      >
        <Menu aria-hidden className="size-5" />
      </IconButton>

      <h1 className="min-w-0 flex-1 truncate text-h2 text-text-primary">
        {title}
      </h1>

      {/* Visual only — search is not wired to anything yet. */}
      <label className="relative hidden lg:block">
        <span className="sr-only">Search</span>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-text-muted"
        />
        <input
          type="search"
          placeholder="Search your closet…"
          className="h-10 w-[240px] cursor-text rounded-full border border-border bg-surface pr-4 pl-11 text-sm text-text-primary transition-all duration-200 placeholder:text-text-muted hover:border-border-strong focus:w-[320px] focus:border-primary-500 focus:shadow-sm focus:outline-none"
        />
      </label>

      <div className="relative">
        <Link
          href="/dashboard/notifications"
          aria-label="Notifications"
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors duration-150 hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <Bell aria-hidden className="size-5" />
        </Link>
        <span
          aria-hidden
          className="pointer-events-none absolute top-1.5 right-1.5 size-2 rounded-full bg-primary-500 ring-2 ring-bg"
        />
        <span className="sr-only">You have unread notifications</span>
      </div>

      <Dropdown
        label="Account menu"
        trigger={<Avatar name={mockUser.name} size="sm" />}
      >
        <div className="px-md py-2">
          <p className="truncate text-sm font-[500] text-text-primary">
            {mockUser.name}
          </p>
          <p className="truncate text-caption text-text-muted">
            {mockUser.email}
          </p>
        </div>
        <DropdownSeparator />
        <Link href="/dashboard/profile">
          <DropdownItem icon={<User />}>Profile</DropdownItem>
        </Link>
        <Link href="/dashboard/settings">
          <DropdownItem icon={<Settings />}>Settings</DropdownItem>
        </Link>
        <DropdownSeparator />
        <Link href="/sign-in">
          <DropdownItem icon={<LogOut />} danger>
            Log out
          </DropdownItem>
        </Link>
      </Dropdown>
    </header>
  );
}
