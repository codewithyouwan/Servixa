import type { Metadata } from "next";
import { LoginSignupCard } from "../../../components/auth/loginSignup";

export const metadata: Metadata = {
  title: "Log in or sign up",
};

export default function LoginPage() {
  return (
    <div className="bg-transparent">
      <div className="flex min-h-dvh w-full items-center justify-center bg-background p-4">
        <LoginSignupCard />
      </div>
    </div>
  );
}