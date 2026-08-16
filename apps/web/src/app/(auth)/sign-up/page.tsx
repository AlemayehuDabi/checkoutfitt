import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplit } from "@/components/layout/auth-split";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Start building your digital closet.",
};

export default function SignUpPage() {
  return (
    <AuthSplit
      tagline="Start with what you already own."
      caption="Photograph your wardrobe once. After that, every outfit suggestion comes from pieces that are already in your closet."
    >
      <h1 className="text-h1 text-text-primary">Create your account</h1>
      <p className="mt-sm text-body text-text-secondary">
        Two minutes to set up. No card needed.
      </p>

      <SignUpForm />

      <p className="mt-2xl text-center text-body text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="rounded-sm font-[500] text-text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          Sign in
        </Link>
      </p>
    </AuthSplit>
  );
}
