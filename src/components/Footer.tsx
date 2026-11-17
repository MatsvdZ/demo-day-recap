import { Waves } from "./Waves";

export function Footer() {
  return (
    <>
      <Waves flip />
      <footer className="footer">
        <div className="container footer__inner">
          <span className="footer__brand">
            AdamI × <span className="brand__mono">DEVLEAPS</span>
          </span>
          <span className="footer__partners">MET AMIIO · IMAGINE DIGITAL · ACE · IN THE STACK, AMSTERDAM</span>
        </div>
      </footer>
    </>
  );
}
