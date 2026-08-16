"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { SocialButtons } from "@/components/auth/social-buttons";

export function SignInForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  // UI only — no auth call. The delay makes the loading state visible.
  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => router.push("/"), 700);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-3xl flex flex-col gap-lg">
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
            autoComplete="current-password"
            inputSize="lg"
            placeholder="••••••••"
            passwordToggle
            required
          />
          <div className="mt-sm flex justify-end">
            <Link
              href="/forgot-password"
              className="rounded-sm text-caption text-text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <Divider label="or continue with" className="my-2xl" />
      <SocialButtons />
    </>
  );
}
