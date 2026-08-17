"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";
import type { MockChatMessage } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { ChatOutfitCard } from "./chat-outfit-card";

function StylistAvatar() {
  return (
    <span
      aria-hidden
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500 ring-1 ring-primary-200"
    >
      <Sparkles className="size-[18px]" />
    </span>
  );
}

/** Author strip above each turn — who is speaking, stated once. */
function TurnHeader({ isUser }: { isUser: boolean }) {
  return (
    <div className="mb-md flex items-center gap-md">
      {isUser ? (
        <Avatar name={mockUser.name} size="sm" className="border-0" />
      ) : (
        <StylistAvatar />
      )}
      <span className="text-body-semibold text-text-primary">
        {isUser ? "You" : "Your stylist"}
      </span>
    </div>
  );
}

/**
 * One conversation turn.
 *
 * Deliberately not a chat bubble. Bubbles exist on phones because the column
 * is ~360px wide and alignment is the only way to tell two speakers apart —
 * at 800px they waste the measure and cap responses at 65% of an already
 * narrow column. Here each turn is a full-width block with an author strip,
 * separated by whitespace: the same pattern ChatGPT, Claude and Linear's AI
 * settled on. The user's turn keeps a tinted panel so the two still read
 * apart at a glance without either being squeezed.
 */
export function MessageBubble({ message }: { message: MockChatMessage }) {
  const isUser = message.role === "USER";

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "rounded-xl px-xl py-lg",
        isUser ? "border border-border bg-surface-secondary/60" : "bg-transparent",
      )}
    >
      <TurnHeader isUser={isUser} />

      {/* Indented to the author name, not the avatar: 32px avatar + 12px gap.
          Both speakers then share one left edge down the column. */}
      <div className="sm:pl-11">
        {message.attachedImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.attachedImageUrl}
            alt="Attached photo"
            className="mb-lg aspect-square w-48 rounded-lg border border-border object-cover shadow-sm"
          />
        )}

        <p className="max-w-[68ch] text-body-lg whitespace-pre-wrap text-text-secondary">
          {message.content}
        </p>

        {/* Structured content sits below the prose as its own block, at full
            column width — not squeezed inside a bubble shape. */}
        {message.outfitCard && <ChatOutfitCard outfit={message.outfitCard} />}
      </div>
    </motion.li>
  );
}

/** Three dots pulsing in the assistant's turn position. */
export function TypingIndicator() {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="px-xl py-lg"
      aria-live="polite"
    >
      <TurnHeader isUser={false} />
      <div className="sm:pl-11">
        <span className="sr-only">Your stylist is typing…</span>
        <span aria-hidden className="flex h-6 items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-2 rounded-full bg-text-muted"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
      </div>
    </motion.li>
  );
}
