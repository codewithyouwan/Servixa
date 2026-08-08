import { ComingSoon } from "@/app/components/shared/coming-soon";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";

export default function ProviderPortfolioPage() {
  return (
    <ComingSoon
      title="Portfolio"
      description="Showcase past projects and photos on your public profile — coming soon."
      backHref={PROVIDER_ROUTES.dashboard}
    />
  );
}
