import { ComingSoon } from "@/app/components/shared/coming-soon";
import { PROVIDER_ROUTES } from "@/lib/provider/constants";

export default function ProviderReviewsPage() {
  return (
    <ComingSoon
      title="Reviews"
      description="Customer reviews and ratings management is coming soon."
      backHref={PROVIDER_ROUTES.dashboard}
    />
  );
}
