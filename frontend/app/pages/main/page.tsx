import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import ProfileMenu from "./components/ProfileMenu";
import ActionBar from "./components/ActionBar";

export const metadata: Metadata = {
  title: "Servixa — Find trusted local contractors",
  description:
    "Describe your project in plain language and get matched with licensed contractors near you.",
};

const POPULAR_SERVICES = [
  "Kitchen Remodel",
  "Bathroom Renovation",
  "Roofing",
  "Electrical",
  "Plumbing",
  "Painting",
  "Flooring",
  "Landscaping",
];

const STATS = [
  { value: "12k+", label: "Verified contractors" },
  { value: "48 hrs", label: "Average match time" },
  { value: "4.8/5", label: "Homeowner rating" },
];

export default function MainPage() {
  return (
    <div className="dark hero-grid min-h-dvh bg-background text-foreground">
      <Navbar />
      <ProfileMenu />

      <main className="relative mx-auto flex min-h-dvh max-w-7xl flex-col items-center justify-center px-4 pb-44 pt-28 sm:px-6 lg:px-8">
        <div className="fade-up flex flex-col items-center text-center">
          <span className="mb-6 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-medium tracking-wide text-secondary-foreground">
            Local contractor matching, powered by AI
          </span>

          <h1 className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            Build anything.
            <br />
            <span className="text-primary">Hire the right crew.</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-base font-light text-muted-foreground sm:text-lg">
            Tell us what you want built, fixed, or remodeled — in your own
            words. We match you with licensed, reviewed contractors in your
            neighborhood.
          </p>
        </div>

        <div className="fade-up fade-up-delay-1 mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          {POPULAR_SERVICES.map((service) => (
            <span
              key={service}
              className="cursor-default rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {service}
            </span>
          ))}
        </div>

        <div className="fade-up fade-up-delay-2 mt-14 grid w-full max-w-2xl grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card/50">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-2 py-5"
            >
              <span className="text-xl font-bold sm:text-2xl">
                {stat.value}
              </span>
              <span className="text-center text-[11px] font-light text-muted-foreground sm:text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </main>

      <ActionBar />
    </div>
  );
}
