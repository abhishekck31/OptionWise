export interface SampleDataBannerViewProps {
  title: string;
  description: string;
}

/** Pure presentational split from SampleDataBanner.tsx — see HomeView.tsx's comment
 * for why (testing next-intl's server-only getTranslations under Vitest). */
export function SampleDataBannerView({ title, description }: SampleDataBannerViewProps) {
  return (
    <div role="status" className="flex items-start gap-2 border-b border-brand bg-card px-4 py-2 text-sm text-ink">
      <span aria-hidden="true">⚠️</span>
      <p>
        <strong>{title}</strong> {description}
      </p>
    </div>
  );
}
