// Speaker photos live in src/assets/speakers/<slug>.webp (square, black and white).
const photos = import.meta.glob<string>("../assets/speakers/*.webp", { eager: true, import: "default" });
const photo = (slug: string) => photos[`../assets/speakers/${slug}.webp`];

export type Demo = {
  code: string;
  title: string;
  speaker: string;
  /** Speaker portrait; without one the pop-up shows initials. */
  photo?: string;
  company: string;
  sector: string;
  /** One or two sentences. Empty shows a placeholder. */
  summary: string;
  /** Exactly three takeaways. Empty strings show a placeholder. */
  takeaways: [string, string, string];
};

export type Channel = {
  id: "A" | "B";
  name: string;
  sub: string;
  codeColor: string;
  demos: Demo[];
};

const empty = (): Pick<Demo, "summary" | "takeaways"> => ({
  summary: "",
  takeaways: ["", "", ""],
});

// Vul per demo een korte samenvatting en drie takeaways in.
export const channels: Channel[] = [
  {
    id: "A",
    name: "Kanaal A.",
    sub: "PODIUM A · KOPTELEFOON OP A",
    codeColor: "var(--red-deep)",
    demos: [
      { code: "A1", photo: photo("philip"), title: "AI Operating Platform: het fundament.", speaker: "Philip Gast", company: "AdamI", sector: "Retail", ...empty() },
      { code: "A2", photo: photo("jochem"), title: "AI Aggregatie: alles wat je wilt weten, in één overzicht.", speaker: "Jochem Bouman", company: "AdamI", sector: "Bouw", ...empty() },
      { code: "A3", photo: photo("roel"), title: "In 1 dag naar een oplossing: The AI Hackathon.", speaker: "Roel Rotteveel", company: "AdamI", sector: "Bouw", ...empty() },
      { code: "A4", title: "De showroom die bij jou past.", speaker: "Gijs Roodenburg", company: "Imagine Digital", sector: "Automotive", ...empty() },
      { code: "A5", photo: photo("jonathan"), title: "Educatie vertaald naar cartoons.", speaker: "Jonathan van Westendorp", company: "AdamI", sector: "Safety", ...empty() },
      { code: "A6", photo: photo("titus"), title: "Gevoelige documenten veilig delen, AVG-proof.", speaker: "Titus Driessen", company: "AdamI", sector: "Privacy", ...empty() },
      { code: "A7", title: "Nieuwe wetgeving zoals DORA in minuten vertaald naar concrete eisen.", speaker: "Mehul Mistry", company: "Ace", sector: "Finance", ...empty() },
      { code: "A8", photo: photo("pieter"), title: "Human-centric process optimization.", speaker: "Pieter de Lange", company: "AdamI", sector: "Logistiek", ...empty() },
    ],
  },
  {
    id: "B",
    name: "Kanaal B.",
    sub: "PODIUM B · KOPTELEFOON OP B",
    codeColor: "var(--color-navy)",
    demos: [
      { code: "B1", title: "Van oude IT-systemen naar een architectuurkaart die je kunt controleren.", speaker: "Jeffrey de Graaf", company: "Devleaps", sector: "IT", ...empty() },
      { code: "B2", title: "Urenregistratie anno 2026.", speaker: "Matthijs Vossen", company: "AdamI", sector: "Agrofood", ...empty() },
      { code: "B3", title: "Vastgoeddata die met elkaar praat.", speaker: "Tim Twisk", company: "Amiio", sector: "Vastgoed", ...empty() },
      { code: "B4", photo: photo("reimer"), title: "Kunnen AI-agents al zelfstandig betalingen tussen bedrijven afhandelen?", speaker: "Reimer Koopal", company: "AdamI", sector: "Finance", ...empty() },
      { code: "B5", photo: photo("euan"), title: "Oplossing die ontwikkelteams helpt.", speaker: "Euan Westenbroek", company: "AdamI", sector: "Publieke sector", ...empty() },
      { code: "B6", title: "Spelregels voor elke AI-agent.", speaker: "Joost Hofmann", company: "Devleaps", sector: "IT", ...empty() },
      { code: "B7", photo: photo("john"), title: "All-in app voor bouwers.", speaker: "John Thoelke", company: "AdamI", sector: "Bouw", ...empty() },
      { code: "B8", photo: photo("noah"), title: "Leer leerlingen weer schrijven én zet de leraar in zijn kracht. Met AI.", speaker: "Noah van Potten", company: "AdamI", sector: "Onderwijs", ...empty() },
    ],
  },
];

export const allDemos: Demo[] = channels.flatMap((c) => c.demos);
