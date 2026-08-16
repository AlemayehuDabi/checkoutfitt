"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { SocialButtons } from "@/components/auth/social-buttons";

/** Mirrors the server's SignUpDto: 8–128 chars. The rest is guidance. */
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

export function SignUpForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const allMet = RULES.every((rule) => rule.test(password));

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    // New accounts land in the style quiz.
    window.setTimeout(() => router.push("/onboarding"), 700);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-3xl flex flex-col gap-lg">
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          inputSize="lg"
          placeholder="Sarah Chen"
          icon={<User />}
          maxLength={100}
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputSize="lg"
          placeholder="you@example.com"
          icon={<Mail />}
          required
        />
        <div>
          <Input
            label="Password"
            name="password"
            autoComplete="new-password"
            inputSize="lg"
            placeholder="Choose a password"
            passwordToggle
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            maxLength={128}
            required
          />
          <ul className="mt-md flex flex-col gap-1.5">
            {RULES.map((rule) => (
              <RuleRow
                key={rule.label}
                label={rule.label}
                met={rule.test(password)}
              />
            ))}
          </ul>
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={submitting}
          disabled={!allMet}
        >
          {submitting ? "Creating account…" : "Create account"}
        </Button>

        <p className="text-center text-caption text-text-muted">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </form>

      <Divider label="or sign up with" className="my-2xl" />
      <SocialButtons verb="Sign up" />
    </>
  );
}
