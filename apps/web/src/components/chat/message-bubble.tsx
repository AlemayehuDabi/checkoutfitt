"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockChatMessage } from "@/lib/mock-data";
import { ChatOutfitCard } from "./chat-outfit-card";

function StylistAvatar() {
  return (
    <span
      aria-hidden
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-500"
    >
      <Sparkles className="size-4" />
    </span>
  );
}

export function MessageBubble({ message }: { message: MockChatMessage }) {
  const isUser = message.role === "USER";

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className={cn("flex gap-md", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && <StylistAvatar />}

      <div
        className={cn(
          "min-w-0",
          // Asymmetric corners point each bubble at its author.
          isUser
            ? "max-w-[65%] rounded-[16px_16px_4px_16px] bg-primary-500 px-lg py-md text-text-on-primary"
            : "max-w-[75%] rounded-[16px_16px_16px_4px] border border-border bg-surface px-lg py-md",
        )}
      >
        {message.attachedImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.attachedImageUrl}
            alt="Attached photo"
            className="mb-md aspect-square w-40 rounded-md border border-border object-cover"
          />
        )}

        <p
          className={cn(
            "text-body whitespace-pre-wrap",
            isUser ? "text-text-on-primary" : "text-text-secondary",
          )}
        >
          {message.content}
        </p>

        {message.outfitCard && <ChatOutfitCard outfit={message.outfitCard} />}
      </div>
    </motion.li>
  );
}

/** Three dots pulsing inside an assistant-shaped bubble. */
export function TypingIndicator() {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-md"
      aria-live="polite"
    >
      <StylistAvatar />
      <div className="rounded-[16px_16px_16px_4px] border border-border bg-surface px-lg py-md">
        <span className="sr-only">Your stylist is typing…</span>
        <span aria-hidden className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-2 rounded-full bg-text-muted"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
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
