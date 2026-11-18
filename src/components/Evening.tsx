import { config } from "../config";
import { Eyebrow } from "./Eyebrow";
import { Movie } from "./Movie";
import { Photos } from "./Photos";

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
          <span className="evening__credit">Foto's: Ana-Maria Hanzu · vrij te delen met vermelding</span>
        </div>

        {config.movieLive ? (
          <Movie />
        ) : (
          <div className="movie tile tile--red">
            <span className="movie__label">AFTERMOVIE</span>
            <span className="movie__title">Komt rond {config.movieDate}.</span>
            <span className="movie__note">Deze pagina vult zich vanzelf aan.</span>
          </div>
        )}

        {config.photosLive ? (
          <Photos />
        ) : (
          <div className="photos">
            {frames.map((cls, i) => (
              <div key={i} className={`photo ${cls}`}>
                <span className="photo__label">FOTO VOLGT</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
