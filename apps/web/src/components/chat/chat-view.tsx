"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Lock, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHAT_SUGGESTIONS,
  mockOutfits,
  mockUser,
  type MockChatMessage,
} from "@/lib/mock-data";
import { MessageBubble, TypingIndicator } from "./message-bubble";
import { PaywallModal } from "./paywall-modal";

/** Canned replies so the conversation goes somewhere plausible. */
function replyTo(prompt: string): { content: string; outfitId?: string } {
  const text = prompt.toLowerCase();
  if (text.includes("meeting") || text.includes("wear")) {
    return {
      content:
        "Here's what I'd wear — structured enough to look deliberate, relaxed enough that you're comfortable all day.",
      outfitId: "ot_01",
    };
  }
  if (text.includes("closet") || text.includes("analyz")) {
    return {
      content:
        "Your closet leans warm and neutral: camel, ivory, charcoal, indigo. You're well covered for office and casual, but thin on genuinely dressy options — one elevated piece would open up evenings without changing your look.",
    };
  }
  return {
    content:
      "Good question. Tell me the occasion and roughly how warm it'll be, and I'll pull something from what you already own.",
  };
}

export function ChatView({ initialMessages }: { initialMessages: MockChatMessage[] }) {
  const [messages, setMessages] = React.useState(initialMessages);
  const [draft, setDraft] = React.useState("");
  const [attachment, setAttachment] = React.useState<{
    name: string;
    preview: string;
  } | null>(null);
  const [thinking, setThinking] = React.useState(false);
  const [paywallOpen, setPaywallOpen] = React.useState(false);

  const endRef = React.useRef<HTMLDivElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const nextId = React.useRef(100);

  // Keep the newest message in view as the thread grows.
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  React.useEffect(() => {
    return () => {
      if (attachment) URL.revokeObjectURL(attachment.preview);
    };
  }, [attachment]);

  function send(text: string) {
    const content = text.trim();
    if (!content) return;

    const userMessage: MockChatMessage = {
      id: `cm_${nextId.current++}`,
      ownerId: mockUser.id,
      role: "USER",
      content,
      attachedImageUrl: attachment?.preview ?? null,
      outfitCardId: null,
      outfitCard: null,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setAttachment(null);
    setThinking(true);

    window.setTimeout(() => {
      const reply = replyTo(content);
      const outfit = reply.outfitId
        ? (mockOutfits.find((o) => o.id === reply.outfitId) ?? null)
        : null;

      setMessages((current) => [
        ...current,
        {
          id: `cm_${nextId.current++}`,
          ownerId: mockUser.id,
          role: "ASSISTANT",
          content: reply.content,
          attachedImageUrl: null,
          outfitCardId: outfit?.id ?? null,
          outfitCard: outfit,
          createdAt: new Date().toISOString(),
        },
      ]);
      setThinking(false);
    }, 1800);
  }

  return (
    // Fills the viewport below the 64px top bar; the negative margin cancels
    // the shell's bottom padding so the input bar sits flush. The darker ground
    // pushes the margins back so the reading column reads as the conversation
    // rather than a stack of bubbles floating in the middle of a wide page.
    <div className="-mx-lg -mb-6xl flex h-[calc(100dvh-4rem)] flex-col bg-surface-secondary sm:-mx-3xl">
      {/* Thread */}
      <div className="flex-1 overflow-y-auto">
        <ul className="mx-auto flex min-h-full w-full max-w-[800px] flex-col gap-lg border-border bg-bg px-lg py-2xl sm:border-x sm:px-2xl">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {thinking && <TypingIndicator key="typing" />}
          </AnimatePresence>
        </ul>
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-[800px] border-border px-lg py-lg sm:border-x sm:px-2xl">
          {/* Suggestions */}
          <div className="no-scrollbar -mx-lg mb-md overflow-x-auto px-lg sm:mx-0 sm:overflow-x-visible sm:px-0">
            <div className="flex w-max items-center gap-sm sm:w-auto sm:flex-wrap">
              {CHAT_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() =>
                    suggestion.pro ? setPaywallOpen(true) : send(suggestion.label)
                  }
                  className={cn(
                    "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-lg text-tag whitespace-nowrap transition-colors duration-150",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                    suggestion.pro
                      ? "border-primary-200 bg-primary-50 text-primary-500"
                      : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-secondary hover:text-text-primary",
                  )}
                >
                  {suggestion.pro && <Lock aria-hidden className="size-3.5" />}
                  {suggestion.label}
                  {suggestion.pro && (
                    <span className="rounded-sm bg-primary-500 px-1.5 py-0.5 text-[10px] font-[700] tracking-[0.06em] text-text-on-primary uppercase">
                      Pro
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Attachment preview */}
          <AnimatePresence>
            {attachment && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="relative mb-md w-fit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="size-20 rounded-md border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    aria-label="Remove attachment"
                    className="absolute -top-2 -right-2 inline-flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-sm transition-colors hover:bg-danger-light hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  >
                    <X aria-hidden className="size-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-sm"
          >
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Attach a photo"
              className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <Paperclip aria-hidden className="size-5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAttachment({
                    name: file.name,
                    preview: URL.createObjectURL(file),
                  });
                }
                e.target.value = "";
              }}
            />

            <label className="flex-1">
              <span className="sr-only">Message your stylist</span>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask your stylist anything…"
                maxLength={2000}
                className="h-11 w-full cursor-text rounded-full border border-border bg-bg px-lg text-body text-text-primary transition-colors placeholder:text-text-muted hover:border-border-strong focus:border-primary-500 focus:shadow-sm focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={!draft.trim() || thinking}
              aria-label="Send message"
              className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-text-on-primary shadow-primary transition-colors hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              <ArrowUp aria-hidden className="size-5" />
            </button>
          </form>
        </div>
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
