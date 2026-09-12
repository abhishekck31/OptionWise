import Link from "next/link";

export default function NotFound() {
  return (
    <div>

      <div className="relative mx-auto max-w-[1200px] px-5 py-24 text-center sm:px-8">
        <p className="font-mono text-6xl font-light text-[#CC3D2E]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-light tracking-tight text-[#1A1A1A]">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6B6B6B]">
          The link may be mistyped or out of date. Start from your rank and work
          forward from there.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#CC3D2E] px-5 text-sm font-medium text-white transition-colors hover:bg-[#B5351F] active:scale-[0.97] sm:w-auto"
          >
            Go Home
          </Link>
          <Link
            href="/predict/rank"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#E5E0D8] bg-transparent px-5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F0EDE8] active:scale-[0.97] sm:w-auto"
          >
            Calculate my rank
          </Link>
        </div>
      </div>
    </div>
  );
}
