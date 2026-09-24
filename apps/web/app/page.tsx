export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">OptionWise</h1>
        <p className="text-lg text-ink/70">Smarter option entry, from rank to college.</p>
        <p className="text-sm text-ink/60">
          This app is under active development. See TASKS.md in the repository for progress.
        </p>
      </main>
      <footer className="border-t border-ink/10 px-6 py-4 text-xs text-ink/60">
        Not affiliated with KEA or any government body.
      </footer>
    </div>
  );
}
