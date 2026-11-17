import { useState, type FormEvent } from "react";
import { allDemos } from "../data/demos";
import { Eyebrow } from "./Eyebrow";

const TOPICS = ["Verder praten over een demo", "Inspiratie opdoen", "Iets anders"];
const STAR = "M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z";

type Props = { picked: Set<string> };

export function Contact({ picked }: Props) {
  const [topic, setTopic] = useState(0);
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);

  const pickedDemos = allDemos.filter((d) => picked.has(d.code));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: send to a backend / form service. The payload is ready here:
    // { topic: TOPICS[topic], demos: pickedDemos.map(d => d.code), rating, ...form fields }
    setSent(true);
  };

  return (
    <section className="container contact-section" aria-labelledby="contact-title">
      <div className="card">
        <Eyebrow>03 · LAAT HET ONS WETEN</Eyebrow>
        <h2 id="contact-title" className="card__title">
          Verder praten, inspiratie of feedback?
        </h2>
        <p className="card__lead">
          Laat het ons weten. We zetten je bericht door naar de spreker van de demo, ook als die bij een van de
          partners werkt. En vertel ons vooral hoe je de avond vond.
        </p>

        {sent ? (
          <div className="sent" role="status">
            <span className="sent__label">ONTVANGEN</span>
            <span className="sent__text">
              Dank je. De juiste persoon komt bij je terug, en we lezen alles over de avond, ook de kritiek.
            </span>
          </div>
        ) : (
          <form className="contact" onSubmit={onSubmit}>
            <div className="contact__col">
              <div className="field-group">
                <span className="field-label" id="topic-label">
                  WAAR GAAT HET OVER
                </span>
                <div className="chips" role="group" aria-labelledby="topic-label">
                  {TOPICS.map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      className={`chip${topic === i ? " is-active" : ""}`}
                      aria-pressed={topic === i}
                      onClick={() => setTopic(i)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <span className="field-label">GEKOZEN DEMO'S · {pickedDemos.length}</span>
                <div className="picked">
                  {pickedDemos.length === 0 ? (
                    <span className="picked__empty">Nog geen demo gekozen. Dat hoeft ook niet.</span>
                  ) : (
                    pickedDemos.map((d) => (
                      <span key={d.code} className="picked__tag">
                        {d.code} · {d.title}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="rating">
                <span className="rating__title">Hoe was de avond?</span>
                <div className="rating__stars" role="group" aria-label="Geef 1 tot 5 sterren">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const on = n <= rating;
                    return (
                      <button
                        key={n}
                        type="button"
                        className="star"
                        aria-label={`${n} van 5 sterren`}
                        aria-pressed={on}
                        onClick={() => setRating(n)}
                      >
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill={on ? "var(--red)" : "none"}
                          stroke={on ? "var(--red)" : "#ffffff"}
                          strokeWidth="1.75"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d={STAR} />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="contact__col contact__col--fields">
              <div className="field-row">
                <label className="field">
                  <span className="field-label">NAAM</span>
                  <input type="text" name="name" autoComplete="name" placeholder="Voornaam Achternaam" required />
                </label>
                <label className="field">
                  <span className="field-label">E-MAIL</span>
                  <input type="email" name="email" autoComplete="email" placeholder="naam@bedrijf.nl" required />
                </label>
              </div>
              <label className="field">
                <span className="field-label">BERICHT (OPTIONEEL)</span>
                <textarea name="message" rows={3} placeholder="Waar ben je benieuwd naar?" />
              </label>
              <label className="field">
                <span className="field-label">JOUW MENING OVER DE AVOND (OPTIONEEL)</span>
                <textarea name="feedback" rows={3} placeholder="Wat vond je ervan? Wat kan er beter?" />
              </label>
              <button type="submit" className="submit">
                Verstuur
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
