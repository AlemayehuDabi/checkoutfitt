"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronsUpDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_GROUPS,
  PROFILE_NAV,
  isActivePath,
  type NavItem,
} from "@/lib/navigation";
import { Avatar } from "@/components/ui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "@/components/ui/dropdown";
import { mockUser } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActivePath(item.href, pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      // Collapsed rail relies on the native tooltip for labels.
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative mx-md flex h-11 items-center gap-md rounded-lg px-md text-sm",
        "transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        collapsed && "justify-center px-0",
        active
          ? "bg-primary-50 font-[600] text-primary-500"
          : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
      )}
    >
      {/* Filled pill plus a left accent bar — the accent is what makes the
          active row legible in the collapsed rail, where the label is gone. */}
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-y-2 -left-md w-[3px] rounded-r-full bg-primary-500"
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
      <Icon
        aria-hidden
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active
            ? "text-primary-500"
            : "text-text-muted group-hover:text-text-secondary",
        )}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Called after navigating, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

export function SidebarContent({
  collapsed,
  onToggleCollapsed,
  onNavigate,
}: SidebarProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const displayName = user?.name || mockUser.name;
  const displayEmail = user?.email || mockUser.email;

  const handleSignOut = async () => {
    onNavigate?.();
    await signOut();
    router.push("/sign-in");
  };

  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border",
          collapsed ? "justify-center px-0" : "justify-between px-xl",
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          aria-label="CheckoutFitt home"
          className="flex items-center gap-md rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          {/* A mark, not just a word — the collapsed rail needs something that
              still reads as the brand at 32px. */}
          <span
            aria-hidden
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-500 text-text-on-primary shadow-primary"
          >
            <Sparkles className="size-[18px]" />
          </span>
          {!collapsed && (
            <span className="text-body-semibold tracking-[-0.2px] text-text-primary">
              CheckoutFitt
            </span>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Collapse sidebar"
            className="hidden cursor-pointer rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:inline-flex"
          >
            <PanelLeftClose aria-hidden className="size-[18px]" />
          </button>
        )}
      </div>

      {/* Groups — separated by whitespace rather than rules, so the rail reads
          as one surface instead of a stack of boxes. */}
      <nav aria-label="Main" className="no-scrollbar flex-1 overflow-y-auto py-lg">
        {NAV_GROUPS.map((group, index) => (
          <div key={group.label} className={index > 0 ? "mt-2xl" : undefined}>
            {!collapsed ? (
              <p className="mb-sm px-2xl text-eyebrow uppercase text-text-muted">
                {group.label}
              </p>
            ) : (
              index > 0 && (
                <div aria-hidden className="mx-auto mb-lg h-px w-8 bg-border" />
              )
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Account */}
      <div className="shrink-0 border-t border-border p-md">
        {collapsed ? (
          <>
            <Link
              href={PROFILE_NAV.href}
              onClick={onNavigate}
              title={displayName}
              className="flex justify-center rounded-lg p-2 transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <Avatar name={displayName} size="sm" />
            </Link>
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label="Expand sidebar"
              className="mt-1 hidden w-full cursor-pointer items-center justify-center rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:flex"
            >
              <PanelLeftOpen aria-hidden className="size-[18px]" />
            </button>
          </>
        ) : (
          <Dropdown
            label="Account menu"
            align="start"
            triggerClassName="w-full rounded-lg"
            className="top-auto bottom-[calc(100%+8px)] left-0 min-w-[224px]"
            trigger={
              <span className="flex w-full items-center gap-md rounded-lg p-2 transition-colors duration-200 hover:bg-surface-secondary">
                <Avatar name={displayName} size="sm" />
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-[500] text-text-primary">
                    {displayName}
                  </span>
                  <span className="block truncate text-caption text-text-muted">
                    {displayEmail}
                  </span>
                </span>
                <ChevronsUpDown
                  aria-hidden
                  className="size-4 shrink-0 text-text-muted"
                />
              </span>
            }
          >
            <DropdownLabel>{displayEmail}</DropdownLabel>
            <DropdownSeparator />
            <DropdownItem href={PROFILE_NAV.href} icon={<User />} onSelect={onNavigate}>
              Profile
            </DropdownItem>
            <DropdownItem href="/dashboard/settings" icon={<Settings />} onSelect={onNavigate}>
              Settings
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem onSelect={handleSignOut} icon={<LogOut />}>
              Log out
            </DropdownItem>
          </Dropdown>
        )}
      </div>
    </div>
  );
}
