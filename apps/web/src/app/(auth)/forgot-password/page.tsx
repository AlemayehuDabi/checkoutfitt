import type { Metadata } from "next";
import { AuthSplit } from "@/components/layout/auth-split";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Get a link to reset your CheckoutFitt password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplit
      tagline="Back in, in a minute."
      caption="We'll email you a link. It stays valid for one hour, and signing in with it ends every other session."
    >
      <ForgotPasswordForm />
    </AuthSplit>
  );
}
