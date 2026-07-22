import type { Metadata } from "next";

import { AuthLayout } from "@/app/components/auth/auth-layout";
import { LoginForm } from "@/app/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — Servixa",
  description:
    "Log in to Servixa to manage your home projects, quotes, and messages.",
};

const TERMINAL_LINES = [
  { prompt: true, text: "servixa match --zip 90210" },
  { muted: true, text: "Parsing project brief…" },
  { text: '  "Remodel a 10x12 kitchen with new cabinets"' },
  { muted: true, text: "Scanning 12,483 verified contractors…" },
  { success: true, text: "✓ 3 licensed crews matched in your area" },
  { success: true, text: "✓ Avg. response time: 4 hours" },
  { prompt: true, text: "", caret: true },
];

const WORKFLOW_STEPS = [
  "Describe your project",
  "AI matches local crews",
  "Compare verified bids",
];

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
