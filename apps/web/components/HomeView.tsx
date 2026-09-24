export interface HomeViewProps {
  title: string;
  tagline: string;
  devNotice: string;
  footer: string;
}

/** Pure presentational split from app/[locale]/page.tsx so it's testable without
 * next-intl's server-only getTranslations (which needs Next's RSC resolve condition
 * that Vitest doesn't set — see AUDIT.md's i18n notes). */
export function HomeView({ title, tagline, devNotice, footer }: HomeViewProps) {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="text-lg text-ink/70">{tagline}</p>
        <p className="text-sm text-ink/60">{devNotice}</p>
      </main>
      <footer className="border-t border-ink/10 px-6 py-4 text-xs text-ink/60">{footer}</footer>
    </div>
  );
}
