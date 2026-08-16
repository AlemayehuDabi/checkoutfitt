"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "danger" | "warning" | "info";

interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

const KIND: Record<
  ToastKind,
  { stripe: string; icon: React.ElementType; iconColor: string }
> = {
  success: { stripe: "bg-success", icon: CheckCircle2, iconColor: "text-success" },
  danger: { stripe: "bg-danger", icon: XCircle, iconColor: "text-danger" },
  warning: { stripe: "bg-warning", icon: AlertTriangle, iconColor: "text-warning" },
  info: { stripe: "bg-info", icon: Info, iconColor: "text-info" },
};

const ToastContext = React.createContext<{
  toast: (t: Omit<Toast, "id">) => void;
} | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const nextId = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (t: Omit<Toast, "id">) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { ...t, id }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Announced to screen readers without stealing focus. */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed top-xl right-xl z-100 flex w-full max-w-[380px] flex-col gap-md"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { stripe, icon: Icon, iconColor } = KIND[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="pointer-events-auto relative flex items-start gap-md overflow-hidden rounded-lg border border-border bg-surface p-lg shadow-lg"
              >
                <span className={cn("absolute inset-y-0 left-0 w-[3px]", stripe)} />
                <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", iconColor)} />
                <div className="min-w-0 flex-1">
                  <p className="text-body-semibold text-text-primary">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-sm text-text-secondary">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="cursor-pointer rounded-full p-1 text-text-muted transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
