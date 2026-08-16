"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Info,
  Shirt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, listItem } from "@/lib/motion";
import {
  mockNotifications,
  type MockNotification,
  type NotificationKind,
} from "@/lib/mock-data";
import { SectionHeader } from "@/components/ui/section-header";
import { StateView } from "@/components/ui/state-view";

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  outfit: Sparkles,
  closet: Shirt,
  insight: BarChart3,
  system: Info,
};

/** "2h ago", "3d ago" — compact enough for a list row. */
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diff / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: MockNotification;
  onRead: () => void;
}) {
  const Icon = KIND_ICON[notification.kind];
  const unread = !notification.read;

  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-md",
          unread ? "bg-primary-50 text-primary-500" : "bg-surface-secondary text-text-muted",
        )}
      >
        <Icon className="size-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-body-medium",
            unread ? "text-text-primary" : "text-text-secondary",
          )}
        >
          {notification.title}
        </span>
        <span className="block text-caption text-text-muted">
          {notification.description}
        </span>
        <span className="mt-1 block text-caption text-text-muted">
          {relativeTime(notification.createdAt)}
        </span>
      </span>

      {unread && (
        <span
          aria-label="Unread"
          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary-500"
        />
      )}
    </>
  );

  const className = cn(
    "flex w-full items-start gap-lg px-xl py-lg text-left transition-colors duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500",
    unread ? "bg-primary-50/40 hover:bg-primary-50" : "hover:bg-surface-secondary",
  );

  return (
    <motion.li variants={listItem} className="border-b border-border last:border-b-0">
      {notification.href ? (
        <Link href={notification.href} onClick={onRead} className={className}>
          {content}
        </Link>
      ) : (
        <button type="button" onClick={onRead} className={cn(className, "cursor-pointer")}>
          {content}
        </button>
      )}
    </motion.li>
  );
}

export function NotificationsList() {
  const [items, setItems] = React.useState(mockNotifications);
  const unreadCount = items.filter((n) => !n.read).length;

  function markRead(id: string) {
    setItems((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function markAllRead() {
    setItems((current) => current.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="mx-auto max-w-[720px] py-2xl">
      <SectionHeader
        eyebrow="Recent"
        title="Notifications"
        description={
          unreadCount > 0
            ? `${unreadCount} unread`
            : "You're all caught up."
        }
        action={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="cursor-pointer rounded-sm text-body-medium text-text-accent transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              Mark all as read
            </button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <StateView
          icon={<Bell />}
          title="No notifications"
          description="When an outfit is ready or your closet finishes processing, you'll hear about it here."
        />
      ) : (
        <motion.ul
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="overflow-hidden rounded-xl border border-border bg-surface shadow-md"
        >
          {items.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onRead={() => markRead(notification.id)}
            />
          ))}
        </motion.ul>
      )}
    </div>
  );
}
