import type { Metadata } from "next";
import { AuthCard } from "../../components/auth/authCard";

export const metadata: Metadata = {
  title: "Log in or sign up",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — hidden on small screens, signature visual on desktop */}
      <div className="relative hidden overflow-hidden bg-graphite-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Ambient orbs: burnt peach, steel blue, verdigris drifting slowly */}
        <div className="pointer-events-none absolute inset-0">
          <div className="orb orb-peach absolute -left-24 top-16 h-80 w-80 rounded-full bg-burnt-peach-500/30 blur-3xl" />
          <div className="orb orb-blue absolute right-0 top-1/3 h-96 w-96 rounded-full bg-steel-blue-500/25 blur-3xl" />
          <div className="orb orb-verdigris absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-verdigris-500/20 blur-3xl" />
          {/* fine dot grid for texture */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-2 text-stone-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-burnt-peach-500 font-bold">
            A
          </div>
          <span className="text-sm font-medium tracking-wide">Acme</span>
        </div>

        <div className="relative z-10 max-w-md space-y-4 text-stone-50">
          <h1 className="text-3xl font-semibold leading-tight">
            Everything you're building, in one place.
          </h1>
          <p className="text-graphite-300">
            Pick up right where you left off — your projects, your team, and
            your history, synced the moment you sign in.
          </p>
        </div>

        <p className="relative z-10 text-xs text-graphite-400">
          © {new Date().getFullYear()} Acme, Inc.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-stone-50 p-6 sm:p-10">
        <AuthCard />
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .orb { animation: drift 14s ease-in-out infinite; }
          .orb-blue { animation-delay: -4s; animation-duration: 18s; }
          .orb-verdigris { animation-delay: -8s; animation-duration: 16s; }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -24px); }
        }
      `}</style>
    </div>
  );
}