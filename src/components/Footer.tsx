import wave from "../assets/wave.jpg";

export function Footer() {
  return (
    <>
      <img className="wave" src={wave} alt="" aria-hidden="true" />
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
