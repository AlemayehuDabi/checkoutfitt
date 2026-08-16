"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_GROUPS,
  PROFILE_NAV,
  isActivePath,
  type NavItem,
} from "@/lib/navigation";
import { Avatar } from "@/components/ui/avatar";
import { mockUser } from "@/lib/mock-data";

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
        "group relative mx-md flex h-[42px] items-center gap-md rounded-md px-lg text-sm transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        collapsed && "justify-center px-0",
        active
          ? "bg-primary-50 font-[600] text-primary-500"
          : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
      )}
    >
      {/* Active rail marker — reads at a glance in the collapsed state. */}
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-primary-500"
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
      <Icon
        aria-hidden
        className={cn(
          "size-5 shrink-0 transition-colors",
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
  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Wordmark */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border",
          collapsed ? "justify-center px-0" : "justify-between px-xl",
        )}
      >
        <Link
          href="/"
          onClick={onNavigate}
          className="rounded-sm text-body-semibold tracking-[-0.2px] text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          {collapsed ? "CF" : "CheckoutFitt"}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Collapse sidebar"
            className="hidden cursor-pointer rounded-full p-1.5 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:inline-flex"
          >
            <PanelLeftClose aria-hidden className="size-[18px]" />
          </button>
        )}
      </div>

      {/* Groups */}
      <nav
        aria-label="Main"
        className="no-scrollbar flex-1 overflow-y-auto py-md"
      >
        {NAV_GROUPS.map((group, index) => (
          <div
            key={group.label}
            className={cn(
              "py-md",
              index > 0 && "border-t border-border",
            )}
          >
            {!collapsed && (
              <p className="mb-1 px-xl text-eyebrow uppercase text-text-muted">
                {group.label}
              </p>
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

      {/* User footer */}
      <div className="shrink-0 border-t border-border p-md">
        <Link
          href={PROFILE_NAV.href}
          onClick={onNavigate}
          title={collapsed ? mockUser.name : undefined}
          className={cn(
            "flex items-center gap-md rounded-md p-2 transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
            collapsed && "justify-center",
          )}
        >
          <Avatar name={mockUser.name} size="sm" />
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-[500] text-text-primary">
                {mockUser.name}
              </span>
              <span className="block truncate text-caption text-text-muted">
                {mockUser.email}
              </span>
            </span>
          )}
        </Link>
        {collapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Expand sidebar"
            className="mt-1 hidden w-full cursor-pointer items-center justify-center rounded-md p-2 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 lg:flex"
          >
            <PanelLeftOpen aria-hidden className="size-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
}
