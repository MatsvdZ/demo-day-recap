import { useEffect, useState, type FormEvent } from "react";
import { config } from "../config";
import { allDemos } from "../data/demos";
import { Eyebrow } from "./Eyebrow";

const TOPICS = ["Verder praten over een demo", "Inspiratie opdoen", "Iets anders"];
const STAR = "M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z";

type Props = { picked: Set<string> };

/** Give up after this long, so the button never hangs on "Versturen…". */
const TIMEOUT_MS = 20_000;
/** After this long, tell the visitor that sending can take a moment. */
const SLOW_MS = 4_000;

type SendError = { title: string; detail: string };

/** Post one submission to Web3Forms; throws a SendError when it doesn't arrive. */
async function deliver(payload: Record<string, string>, signal: AbortSignal) {
  let res: Response;
  try {
    res = await fetch(config.form.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    console.error("Contact form failed:", err);
    throw explain(err);
  }
  const data: { success?: unknown; message?: string } = await res.json().catch(() => ({}));
  // Web3Forms answers { success: true | false, message }.
  if (!res.ok || String(data.success) !== "true") {
    const reason = data.message || `HTTP ${res.status} ${res.statusText}`.trim();
    console.error("Contact form rejected:", reason);
    throw explain(new Error(reason), reason);
  }
}

/** Turn whatever went wrong into a clear Dutch message with the real reason. */
function explain(err: unknown, serviceMessage?: string): SendError {
  if (err instanceof DOMException && err.name === "AbortError") {
    return {
      title: "Het versturen duurde te lang.",
      detail: `De verzenddienst reageerde niet binnen ${TIMEOUT_MS / 1000} seconden. Je bericht is waarschijnlijk niet aangekomen; probeer het opnieuw.`,
    };
  }
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      title: "Je bent niet verbonden met internet.",
      detail: "Controleer je verbinding en probeer het opnieuw. Wat je hebt ingevuld blijft staan.",
    };
  }
  if (err instanceof TypeError) {
    // fetch() throws a TypeError when the request never reaches the server.
    return {
      title: "De verzenddienst is niet bereikbaar.",
      detail: "Mogelijk blokkeert je netwerk, VPN of adblocker het verzoek. Probeer het op een ander netwerk of later opnieuw.",
    };
  }
  const msg = serviceMessage ?? (err instanceof Error ? err.message : String(err));
  if (/access.?key|not configured/i.test(msg)) {
    return {
      title: "Het formulier is niet goed ingesteld.",
      detail: `De verzenddienst herkent de toegangssleutel niet (${msg.replace(/[.\s]+$/, "")}). Je bericht is niet verstuurd; probeer het later opnieuw.`,
    };
  }
  return {
    title: "De verzenddienst weigerde het bericht.",
    detail: `Reden: ${msg.replace(/[.\s]+$/, "") || "onbekend"}. Probeer het opnieuw.`,
  };
}

export function Contact({ picked }: Props) {
  const [topic, setTopic] = useState(0);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<SendError | null>(null);
  const [slow, setSlow] = useState(false);
  const sent = status === "sent";

  // While sending, flag "slow" after a few seconds so the visitor knows it's still working.
  useEffect(() => {
    if (status !== "sending") return;
    const t = window.setTimeout(() => setSlow(true), SLOW_MS);
    return () => {
      window.clearTimeout(t);
      setSlow(false);
    };
  }, [status]);

  const pickedDemos = allDemos.filter((d) => picked.has(d.code));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const f = new FormData(e.currentTarget);
    // Honeypot: real visitors never see or fill this field.
    if (f.get("botcheck")) return;

    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    // Web3Forms: access_key/subject/from_name/replyto/botcheck are its own fields;
    // everything else is listed in the email as-is.
    const payload = {
      access_key: config.form.accessKey,
      subject: `Demo Day Recap · ${TOPICS[topic]} · ${name}`,
      from_name: "Demo Day Recap",
      replyto: email,
      botcheck: "",
      Naam: name,
      "E-mail": email,
      Onderwerp: TOPICS[topic],
      "Gekozen demo's": pickedDemos.length
        ? pickedDemos.map((d) => `${d.code} · ${d.title} (${d.speaker}, ${d.company})`).join("\n")
        : "Geen",
      "Beoordeling avond": rating ? `${rating} van 5 sterren` : "Niet gegeven",
      Bericht: String(f.get("message") ?? "").trim() || "—",
      "Mening over de avond": String(f.get("feedback") ?? "").trim() || "—",
    };

    setStatus("sending");
    setError(null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      await deliver(payload, controller.signal);
      setStatus("sent");
    } catch (err) {
      setError(err as SendError);
      setStatus("error");
    } finally {
      window.clearTimeout(timer);
    }
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
              {/* Honeypot for spam bots; hidden from people and assistive tech. */}
              <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="honey" aria-hidden="true" />
              {status === "error" && error && (
                <div className="form-error" role="alert">
                  <strong>{error.title}</strong> {error.detail}
                </div>
              )}
              <div className="submit-row">
                <button type="submit" className="submit" disabled={status === "sending"} aria-busy={status === "sending"}>
                  {status === "sending" ? "Versturen…" : status === "error" ? "Opnieuw versturen" : "Verstuur"}
                </button>
                {status === "sending" && slow && (
                  <span className="submit-hint" role="status">
                    Nog even geduld, dit kan een paar seconden duren.
                  </span>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
