/**
 * Renders a real country flag image (works on every OS — unlike emoji flags,
 * which Windows displays as two-letter codes like "GB" / "JP").
 *
 * Flags are served as SVGs from flagcdn.com. `code` is the ISO 3166-1 alpha-2
 * country code in lowercase (e.g. "gb", "jp", "eu").
 *
 * Pass sizing via `className` (e.g. "h-6 w-auto"); width auto-keeps the ratio.
 */
type FlagProps = {
  code: string;
  name?: string;
  className?: string;
};

export default function Flag({ code, name, className }: FlagProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={name ? `${name} flag` : ""}
      aria-hidden={name ? undefined : true}
      loading="lazy"
      className={className}
    />
  );
}
