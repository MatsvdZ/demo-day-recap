import { useState } from "react";
import { channels, type Channel, type Demo } from "../data/demos";
import { DemoModal } from "./DemoModal";
import { Eyebrow } from "./Eyebrow";

type Props = {
  picked: Set<string>;
  onTogglePick: (code: string) => void;
};

const PLUS = "M12 5v14M5 12h14";
const CHECK = "M5 12.5l4.5 4.5L19 7.5";

type Active = { demo: Demo; channel: Channel; origin: HTMLElement };

export function DemoList({ picked, onTogglePick }: Props) {
  const [active, setActive] = useState<Active | null>(null);

  return (
    <section className="container demos" aria-labelledby="demos-title">
      <div className="section-head demos__intro">
        <Eyebrow>02 · DE DEMO'S</Eyebrow>
        <h2 id="demos-title" className="section-title">
          Beide kanalen, op een rij.
        </h2>
        <p className="demos__lead">
          Iets gemist of wil je er meer over horen? Klik op een demo voor een korte samenvatting en de drie
          takeaways. Met het plusje neem je hem mee in je bericht onderaan.
        </p>
      </div>

      <div className="channels">
        {channels.map((c) => (
          <div key={c.id} className="channel" style={{ "--code-color": c.codeColor } as React.CSSProperties}>
            <div className="channel__head">
              <span className="channel__name">{c.name}</span>
              <span className="channel__sub">{c.sub}</span>
            </div>
            {c.demos.map((d) => (
              <DemoRow
                key={d.code}
                demo={d}
                isActive={active?.demo.code === d.code}
                isPicked={picked.has(d.code)}
                onOpen={(origin) => setActive({ demo: d, channel: c, origin })}
                onTogglePick={() => onTogglePick(d.code)}
              />
            ))}
          </div>
        ))}
      </div>

      {active && (
        <DemoModal
          key={active.demo.code}
          demo={active.demo}
          channel={active.channel}
          origin={active.origin}
          isPicked={picked.has(active.demo.code)}
          onTogglePick={() => onTogglePick(active.demo.code)}
          onClosed={() => setActive(null)}
        />
      )}
    </section>
  );
}

type RowProps = {
  demo: Demo;
  isActive: boolean;
  isPicked: boolean;
  onOpen: (origin: HTMLElement) => void;
  onTogglePick: () => void;
};

function DemoRow({ demo: d, isActive, isPicked, onOpen, onTogglePick }: RowProps) {
  return (
    <div className={`demo${isActive ? " is-active" : ""}`}>
      <div className="demo__row">
        <span className="demo__code">{d.code}</span>
        <button
          type="button"
          className="demo__toggle"
          onClick={(e) => onOpen(e.currentTarget.closest(".demo__row") as HTMLElement)}
          aria-haspopup="dialog"
          aria-label={`Open recap van ${d.code}: ${d.title}`}
        >
          {d.photo && (
            <span className="demo__avatar" aria-hidden="true">
              <img src={d.photo} alt="" loading="lazy" />
            </span>
          )}
          <span className="demo__text">
            <span className="demo__title">{d.title}</span>
            <span className="demo__who">
              {d.speaker} · {d.company} · {d.sector.toUpperCase()}
            </span>
          </span>
          <svg
            className="demo__open"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </button>
        <button
          type="button"
          className={`pick${isPicked ? " is-picked" : ""}`}
          onClick={onTogglePick}
          aria-pressed={isPicked}
          aria-label={`${isPicked ? "Gekozen: " : "Kies "}${d.code}`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={isPicked ? CHECK : PLUS} />
          </svg>
        </button>
      </div>
    </div>
  );
}
