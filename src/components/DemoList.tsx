import { useState } from "react";
import { channels, type Channel, type Demo } from "../data/demos";
import { Eyebrow } from "./Eyebrow";

type Props = {
  picked: Set<string>;
  onTogglePick: (code: string) => void;
};

const PLUS = "M12 5v14M5 12h14";
const CHECK = "M5 12.5l4.5 4.5L19 7.5";

export function DemoList({ picked, onTogglePick }: Props) {
  const [open, setOpen] = useState<string | null>(null);

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
          <ChannelColumn
            key={c.id}
            channel={c}
            open={open}
            onToggleOpen={(code) => setOpen((o) => (o === code ? null : code))}
            picked={picked}
            onTogglePick={onTogglePick}
          />
        ))}
      </div>
    </section>
  );
}

type ColumnProps = Props & {
  channel: Channel;
  open: string | null;
  onToggleOpen: (code: string) => void;
};

function ChannelColumn({ channel, open, onToggleOpen, picked, onTogglePick }: ColumnProps) {
  return (
    <div className="channel" style={{ "--code-color": channel.codeColor } as React.CSSProperties}>
      <div className="channel__head">
        <span className="channel__name">{channel.name}</span>
        <span className="channel__sub">{channel.sub}</span>
      </div>
      {channel.demos.map((d) => (
        <DemoRow
          key={d.code}
          demo={d}
          isOpen={open === d.code}
          isPicked={picked.has(d.code)}
          onToggleOpen={() => onToggleOpen(d.code)}
          onTogglePick={() => onTogglePick(d.code)}
        />
      ))}
    </div>
  );
}

type RowProps = {
  demo: Demo;
  isOpen: boolean;
  isPicked: boolean;
  onToggleOpen: () => void;
  onTogglePick: () => void;
};

function DemoRow({ demo: d, isOpen, isPicked, onToggleOpen, onTogglePick }: RowProps) {
  const panelId = `demo-${d.code}-details`;
  return (
    <div className="demo">
      <div className="demo__row">
        <span className="demo__code">{d.code}</span>
        <button
          type="button"
          className="demo__toggle"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={`${isOpen ? "Verberg" : "Toon"} samenvatting van ${d.code}`}
        >
          <span className="demo__text">
            <span className="demo__title">{d.title}</span>
            <span className="demo__who">
              {d.speaker} · {d.company} · {d.sector.toUpperCase()}
            </span>
          </span>
          <svg
            className={`demo__chevron${isOpen ? " is-open" : ""}`}
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
            <path d="M6 9l6 6 6-6" />
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

      {isOpen && (
        <div id={panelId} className="demo__details">
          <p className="demo__summary">
            {d.summary || `[Korte samenvatting van ${d.code} in één of twee zinnen]`}
          </p>
          <div className="takeaways">
            <span className="takeaways__label">3 TAKEAWAYS</span>
            {d.takeaways.map((t, i) => (
              <div key={i} className="takeaway">
                <span className="takeaway__n">0{i + 1}</span>
                <span className="takeaway__text">{t || `[Takeaway ${i + 1}]`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
