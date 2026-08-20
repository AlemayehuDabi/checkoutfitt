"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Check, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
];

function RuleRow({ label, met }: { label: string; met: boolean }) {
  return (
    <li className="flex items-center gap-sm">
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scale: met ? 1 : 0.85 }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
          met ? "bg-success text-white" : "bg-surface-tertiary text-transparent",
        )}
      >
        <Check className="size-2.5" strokeWidth={3} />
      </motion.span>
      <span
        className={cn(
          "text-caption transition-colors duration-200",
          met ? "text-text-secondary" : "text-text-muted",
        )}
      >
        {label}
      </span>
    </li>
  );
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const { resetPassword } = useAuth();
  const [manualToken, setManualToken] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const effectiveToken = tokenParam || manualToken;
  const allMet = RULES.every((rule) => rule.test(newPassword));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!effectiveToken) {
      setError("Reset token is missing. Please use the reset link sent to your email.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      await resetPassword({ newPassword, token: effectiveToken });
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. The link may have expired.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-success-light text-success">
            <CheckCircle2 aria-hidden className="size-7" />
          </span>
          <h1 className="mt-xl text-h1 text-text-primary">Password Reset Complete</h1>
          <p className="mt-md text-body text-text-secondary">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <div className="mt-2xl flex flex-col gap-md">
            <ButtonLink
              href="/sign-in"
              size="lg"
              fullWidth
              iconLeft={<ArrowLeft className="size-4" />}
            >
              Sign in to your account
            </ButtonLink>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="text-h1 text-text-primary">Create new password</h1>
          <p className="mt-sm text-body text-text-secondary">
            Enter your new password below to update your account password.
          </p>

          <form onSubmit={onSubmit} className="mt-3xl flex flex-col gap-lg">
            {error && (
              <div className="flex items-center gap-md rounded-md bg-danger-light p-md text-caption text-danger">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!tokenParam && (
              <Input
                label="Reset Token"
                name="token"
                type="text"
                inputSize="lg"
                placeholder="Enter reset token..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                required
              />
            )}

            <div>
              <Input
                label="New Password"
                name="newPassword"
                autoComplete="new-password"
                inputSize="lg"
                placeholder="Enter new password"
                passwordToggle
                icon={<Lock className="size-4" />}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                maxLength={128}
                required
              />
              <ul className="mt-md flex flex-col gap-1.5">
                {RULES.map((rule) => (
                  <RuleRow
                    key={rule.label}
                    label={rule.label}
                    met={rule.test(newPassword)}
                  />
                ))}
              </ul>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={submitting}
              disabled={!allMet || !effectiveToken.trim()}
            >
              {submitting ? "Resetting password…" : "Reset password"}
            </Button>
          </form>

          <Link
            href="/sign-in"
            className="mt-2xl inline-flex items-center gap-sm rounded-sm text-body text-text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to sign in
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
