import Link from "next/link";

export default function NotFound() {
  return (
    <div>

      <div className="relative mx-auto flex max-w-[1120px] flex-col items-center px-6 py-[96px] text-center sm:px-8">
        <p className="type-mono-lg text-[#C9C4BC]">
          404
        </p>
        <h1 className="type-h1 mt-6">
          Page not found
        </h1>
        <p className="type-body-lg mx-auto mt-4 max-w-md">
          The link may be mistyped or out of date. Start from your rank and work
          forward from there.
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="btn btn-primary w-full sm:w-auto"
          >
            Go home
          </Link>
          <Link
            href="/predict/rank"
            className="btn btn-ghost w-full sm:w-auto"
          >
            Calculate my rank
          </Link>
        </div>
      </div>
    </div>
  );
}
