import { Logos } from "./Logos";
import { Waves } from "./Waves";

export function Footer() {
  return (
    <>
      <Waves flip />
      <footer className="footer">
        <div className="container footer__inner">
          <Logos onDark className="footer__logos" />
          <span className="footer__partners">MET AMIIO · IMAGINE DIGITAL · ACE · IN THE STACK, AMSTERDAM</span>
        </div>
      </footer>
    </>
  );
}
