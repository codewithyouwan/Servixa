import type { Metadata } from "next";

import { AccountTypeProvider } from "@/app/components/auth/account-type-context";
import { AuthLayout } from "@/app/components/auth/auth-layout";
import { SignupForm } from "@/app/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up — BestBuild",
  description:
    "Create a free BestBuild account — post home projects as a homeowner, grow your business as a service provider, or showcase your products as a brand.",
};

export default function SignupPage() {
  return (
    /* The provider lets the brand panel (left) react to the account type
       selected in the form (right). */
    <AccountTypeProvider>
      <AuthLayout
        panelTitle="Start your next project with confidence."
        panelDescription="Join thousands of homeowners and service providers using AI to plan projects, match with the right pros, and compare quotes."
      >
        <SignupForm />
      </AuthLayout>
    </AccountTypeProvider>
  );
}
