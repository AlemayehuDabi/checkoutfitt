import type { Metadata } from "next";
import { OnboardingWizard } from "./wizard";

export const metadata: Metadata = {
  title: "Style quiz",
  description: "Tell us how you dress so outfit suggestions land right.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
