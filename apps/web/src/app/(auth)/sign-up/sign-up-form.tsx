"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Check, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { SocialButtons } from "@/components/auth/social-buttons";
import { useAuth } from "@/lib/auth-context";

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
  const { signUp } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const allMet = RULES.every((rule) => rule.test(password));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signUp({ name, email, password });
      // New accounts land in the style quiz.
      router.push("/onboarding");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-3xl flex flex-col gap-lg">
        {error && (
          <div className="flex items-center gap-md rounded-md bg-danger-light p-md text-caption text-danger">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Name"
          name="name"
          autoComplete="name"
          inputSize="lg"
          placeholder="Sarah Chen"
          icon={<User />}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
