type Props = { children: React.ReactNode; onDark?: boolean };

/** Bordered mono label above a section heading, e.g. "01 · DE AVOND". */
export function Eyebrow({ children, onDark }: Props) {
  return <span className={`eyebrow${onDark ? " eyebrow--on-dark" : ""}`}>{children}</span>;
}
