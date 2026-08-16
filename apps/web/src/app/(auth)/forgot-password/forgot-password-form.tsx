"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-success-light text-success">
            <MailCheck aria-hidden className="size-7" />
          </span>
          <h1 className="mt-xl text-h1 text-text-primary">Check your inbox</h1>
          {/* Deliberately doesn't confirm whether the address exists — the API
              returns the same response either way to prevent enumeration. */}
          <p className="mt-md text-body text-text-secondary">
            If an account exists for{" "}
            <span className="font-[500] text-text-primary">
              {email || "that address"}
            </span>
            , a reset link is on its way. It expires in one hour.
          </p>
          <div className="mt-2xl flex flex-col gap-md">
            <Button variant="outline" size="lg" fullWidth onClick={() => setSent(false)}>
              Use a different email
            </Button>
            <Link href="/sign-in" className="w-full">
              <Button variant="ghost" size="lg" fullWidth iconLeft={<ArrowLeft className="size-4" />}>
                Back to sign in
              </Button>
            </Link>
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
          <h1 className="text-h1 text-text-primary">Reset your password</h1>
          <p className="mt-sm text-body text-text-secondary">
            Enter the email you signed up with and we&apos;ll send a reset link.
          </p>

          <form onSubmit={onSubmit} className="mt-3xl flex flex-col gap-lg">
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              inputSize="lg"
              placeholder="you@example.com"
              icon={<Mail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" size="lg" fullWidth loading={submitting}>
              {submitting ? "Sending…" : "Send reset link"}
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
