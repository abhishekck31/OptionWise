/**
 * Three dots passing a beat along — the loading mark for anything that is
 * about to arrive, in place of a spinner.
 */
export function LoadingDots({ label }: { label?: React.ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center gap-5 py-24 text-center">
      <span aria-hidden className="flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="dot-beat size-2 rounded-full bg-[#CC3D2E]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      {label && <p className="text-[14px] text-[#9B9B9B]">{label}</p>}
    </div>
  );
}

export default LoadingDots;
