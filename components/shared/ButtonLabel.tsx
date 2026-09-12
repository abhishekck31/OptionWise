/**
 * The inside of a `.btn` that can be busy.
 *
 * The label and a spinner sit in the same box; `data-loading` on the button
 * cross-fades one for the other, so the button keeps its width while it works.
 */
export function ButtonLabel({
  children,
  loading = false,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <>
      <span className="btn-label inline-flex items-center gap-2">
        {children}
      </span>
      <span className="btn-spinner" aria-hidden={!loading}>
        <span className="spinner" />
      </span>
    </>
  );
}

export default ButtonLabel;
