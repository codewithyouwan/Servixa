import type { Metadata } from "next";

import { AuthLayout } from "@/app/components/auth/auth-layout";
import { SignupForm } from "@/app/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up — Servixa",
  description:
    "Create a free Servixa account — post home projects as a homeowner or grow your business as a service provider.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      panelTitle="Start your next project with confidence."
      panelDescription="Join thousands of homeowners and service providers using AI to plan projects, match with the right pros, and compare quotes."
    >
      <SignupForm />
    </AuthLayout>
  );
}
