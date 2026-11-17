import headphones from "../assets/headphones.jpg";
import { Waves } from "./Waves";

export function Hero() {
  return (
    <header className="hero">
      <div className="container hero__top">
        <span className="brand">
          AdamI <span className="accent">×</span> <span className="brand__mono accent">DEVLEAPS</span>
        </span>
        <span className="badge">DEMO DAY RECAP</span>
      </div>

      <div className="container hero__main">
        <div className="hero__copy">
          <span className="hero__meta">DO 12 NOVEMBER 2026 · THE STACK, AMSTERDAM</span>
          <h1 className="hero__title">
            Demo
            <br />
            Day<span className="hero__dot">.</span>
          </h1>
          <span className="hero__recap">Recap</span>
          <p className="hero__lead">
            Zestien demo's op twee kanalen, dus je hoorde er hooguit acht. Hier vind je ze allemaal terug, met de
            foto's van de avond.
          </p>
        </div>
        <div className="hero__art">
          <img src={headphones} alt="Koptelefoon in rood en blauw, het beeld van Demo Day" />
        </div>
      </div>

      <div className="container hero__stats">
        <span>16 DEMO'S · 2 KANALEN · 1 AVOND</span>
      </div>
      <Waves className="hero__waves" />
    </header>
  );
}
