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

      <div className="relative mx-auto flex max-w-[1120px] flex-col items-center px-6 py-[96px] text-center sm:px-8">
        <p className="type-caption">Something went wrong</p>
        <h1 className="type-h1 mt-4">
          This page stopped part way through
        </h1>
        <p className="type-body-lg mx-auto mt-4 max-w-md">
          Your saved rank and option list live in this browser, so they are still
          there. Try loading the page again.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-[12px] text-[#9B9B9B]">
            Reference {error.digest}
          </p>
        )}

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="btn btn-primary w-full sm:w-auto"
          >
            <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="btn btn-ghost w-full sm:w-auto"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
