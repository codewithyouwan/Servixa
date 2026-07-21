import type { Metadata } from "next";

import { AuthLayout } from "@/app/components/auth/auth-layout";
import { LoginForm } from "@/app/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — Servixa",
  description:
    "Log in to Servixa to manage your home projects, quotes, and messages.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      panelTitle="Your projects, one trusted place."
      panelDescription="Pick up where you left off — track quotes, message service providers, and watch your project progress in real time."
    >
      <LoginForm />
    </AuthLayout>
  );
}
