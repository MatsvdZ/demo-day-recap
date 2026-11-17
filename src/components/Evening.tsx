import { config } from "../config";
import { Eyebrow } from "./Eyebrow";

// Photo slots: frames 3 and 6 use the red tile.
const frames = Array.from({ length: 8 }, (_, i) => (i === 2 || i === 5 ? "tile tile--red" : "tile"));

export function Evening() {
  return (
    <section className="evening" aria-labelledby="evening-title">
      <div className="container evening__inner">
        <div className="evening__head">
          <div className="section-head">
            <Eyebrow onDark>01 · DE AVOND</Eyebrow>
            <h2 id="evening-title" className="section-title">
              Zo zag het eruit.
            </h2>
          </div>
          <span className="evening__credit">Foto's: [fotograaf] · vrij te delen met vermelding</span>
        </div>

        <div className="movie tile tile--red">
          {config.movieLive ? (
            <>
              <button type="button" className="movie__play" aria-label="Speel de aftermovie af">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <span className="movie__label">AFTERMOVIE</span>
            </>
          ) : (
            <>
              <span className="movie__label">AFTERMOVIE</span>
              <span className="movie__title">Komt rond {config.movieDate}.</span>
              <span className="movie__note">Deze pagina vult zich vanzelf aan.</span>
            </>
          )}
        </div>

        <div className="photos">
          {frames.map((cls, i) => (
            <div key={i} className={`photo ${cls}`}>
              {!config.photosLive && <span className="photo__label">FOTO VOLGT</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
