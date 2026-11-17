import adamiLogo from "../assets/adami-logo.webp";
import devleapsLogo from "../assets/devleaps-logo.svg";

type Props = {
  /** White AdamI mark, for navy grounds. */
  onDark?: boolean;
  className?: string;
};

/** AdamI × DevLeaps lockup. */
export function Logos({ onDark, className }: Props) {
  return (
    <span className={`logos${onDark ? " logos--on-dark" : ""}${className ? ` ${className}` : ""}`}>
      <img className="logos__adami" src={adamiLogo} alt="AdamI" />
      <span className="logos__x" aria-hidden="true">
        ×
      </span>
      <img className="logos__devleaps" src={devleapsLogo} alt="DevLeaps" />
    </span>
  );
}
