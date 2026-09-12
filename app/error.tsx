"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>

      <div className="relative mx-auto max-w-[1200px] px-5 py-24 text-center sm:px-8">
        <p className="font-mono text-sm text-[#CC3D2E]">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-light tracking-tight text-[#1A1A1A]">
          This page stopped part way through
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6B6B6B]">
          Your saved rank and option list live in this browser, so they are still
          there. Try loading the page again.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-xs text-[#9B9B9B]">
            Reference {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#CC3D2E] px-5 text-sm font-medium text-white transition-colors hover:bg-[#B5351F] active:scale-[0.97] sm:w-auto"
          >
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#E5E0D8] bg-transparent px-5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F0EDE8] active:scale-[0.97] sm:w-auto"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
