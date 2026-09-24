export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight">OptionWise</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Smarter option entry, from rank to college.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          This app is under active development. See TASKS.md in the repository for progress.
        </p>
      </main>
      <footer className="border-t border-zinc-200 px-6 py-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        Not affiliated with KEA or any government body.
      </footer>
    </div>
  );
}
