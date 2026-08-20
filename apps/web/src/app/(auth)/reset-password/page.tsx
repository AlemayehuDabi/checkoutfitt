import * as React from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your CheckoutFitt account.",
};

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="py-xl text-center text-text-muted">Loading...</div>}>
      <ResetPasswordForm />
    </React.Suspense>
  );
}
