import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplit } from "@/components/layout/auth-split";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your CheckoutFitt wardrobe.",
};

export default function SignInPage() {
  return (
    <AuthSplit
      tagline="Your closet, finally working for you."
      caption="Every piece you own, catalogued and ready to wear — with outfits picked for the weather, the occasion, and the day ahead."
    >
      <h1 className="text-h1 text-text-primary">Welcome back</h1>
      <p className="mt-sm text-body text-text-secondary">
        Sign in to pick up where you left off.
      </p>

      <SignInForm />

      <p className="mt-2xl text-center text-body text-text-secondary">
        New here?{" "}
        <Link
          href="/sign-up"
          className="rounded-sm font-[500] text-text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          Create an account
        </Link>
      </p>
    </AuthSplit>
  );
}
