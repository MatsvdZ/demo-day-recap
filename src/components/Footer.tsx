import { Logos } from "./Logos";
import { Waves } from "./Waves";
import amiio from "../assets/partners/amiio.webp";
import imagine from "../assets/partners/imagine.webp";
import ace from "../assets/partners/ace.webp";

const PARTNERS = [
  { name: "Amiio", src: amiio, key: "amiio" },
  { name: "Imagine Digital", src: imagine, key: "imagine" },
  { name: "Ace", src: ace, key: "ace" },
];

export function Footer() {
  return (
    <>
      <Waves flip />
      <footer className="footer">
        <div className="container footer__inner">
          <Logos onDark className="footer__logos" />
          <div className="footer__partners">
            <span className="footer__label">MET</span>
            <ul className="partners" aria-label="Partners">
              {PARTNERS.map((p) => (
                <li key={p.key}>
                  <img className={`partners__logo partners__logo--${p.key}`} src={p.src} alt={p.name} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container footer__place">IN THE STACK, AMSTERDAM</div>
      </footer>
    </>
  );
}
