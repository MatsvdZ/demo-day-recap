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
      { code: "A4", photo: photo("gijs"), title: "De showroom die bij jou past.", speaker: "Gijs Roodenburg", company: "Imagine Digital", sector: "Automotive", ...empty() },
      { code: "A5", photo: photo("jonathan"), title: "Educatie vertaald naar cartoons.", speaker: "Jonathan van Westendorp", company: "AdamI", sector: "Safety", ...empty() },
      { code: "A6", photo: photo("titus"), title: "Gevoelige documenten veilig delen, AVG-proof.", speaker: "Titus Driessen", company: "AdamI", sector: "Privacy", ...empty() },
      { code: "A7", photo: photo("mehul"), title: "Nieuwe wetgeving zoals DORA in minuten vertaald naar concrete eisen.", speaker: "Mehul Mistry", company: "Ace", sector: "Finance", ...empty() },
      { code: "A8", photo: photo("pieter"), title: "Human-centric process optimization.", speaker: "Pieter de Lange", company: "AdamI", sector: "Logistiek", ...empty() },
    ],
  },
  {
    id: "B",
    name: "Kanaal B.",
    sub: "PODIUM B · KOPTELEFOON OP B",
    codeColor: "var(--color-navy)",
    demos: [
      { code: "B1", photo: photo("jeffrey"), title: "Van oude IT-systemen naar een architectuurkaart die je kunt controleren.", speaker: "Jeffrey de Graaf", company: "Devleaps", sector: "IT", 
        summary: "Jeffrey liet ArchiJeff zien: een tool die van code, telemetrie, documenten en tickets één architectuurkaart maakt van een legacy-landschap, met bij elk onderdeel de bron. Code wordt zonder AI gelezen; een taalmodel leest alleen de documenten en moet elke bewering met een citaat onderbouwen.",
        takeaways: [
          "Vraag AI om de bron: laat een model bij elke bewering de regel en het citaat noemen, en neem niets over wat je niet kunt controleren.",
          "Schrijf op wat je niet weet: een gelabelde open vraag is eerlijker dan een aanname die er goed uitziet.",
          "Houd feiten en mening apart, zodat iedereen ziet wat vaststaat en wat een interpretatie is.",
        ],
      },
      { code: "B2", photo: photo("matthijs"), title: "Urenregistratie anno 2026.", speaker: "Matthijs Vossen", company: "AdamI", sector: "Agrofood", 
        summary: "Bij een versverwerker typten drie mensen elke dag 160 handgeschreven productiebriefjes over, samen zo'n 15 uur werk. In plaats van de hele werkvloer te digitaliseren, leest AI nu de scans uit en kijkt een mens alleen na waar het systeem twijfelt: van 15 naar 3 uur per dag.",
        takeaways: [
          "Zoek de échte bottleneck: de pijn zat niet in het schrijven op papier, maar in het overtypen.",
          "Hoe minder mensen anders hoeven te werken, hoe sneller je resultaat hebt. Hier veranderde het werk van drie mensen, niet van de hele vloer.",
          "Kijk opnieuw naar wat niet kon: handschrift lezen kan nu, zolang het systeem eerlijk is over wat het niet zeker weet.",
        ],
      },
      { code: "B3", photo: photo("tim"), title: "Vastgoeddata die met elkaar praat.", speaker: "Tim Twisk", company: "Amiio", sector: "Vastgoed", 
        summary: "Amiio is een AI operating layer bovenop bestaande vastgoedsystemen. Het verbindt contracten, budgetten en prestaties, legt verbanden en meldt risico's voordat ze zich opstapelen, zodat een vastgoedbeheerder kan groeien zonder evenredig meer mensen.",
        takeaways: [
          "Denk organisatiebreed: een AI-assistent per medewerker versnelt individueel werk, maar waarde ontstaat pas als kennis en inzichten gedeeld worden.",
          "Train AI op jouw branche: AI met vakkennis weet welke documenten belangrijk zijn en welke stappen gevalideerd moeten worden.",
          "Meet wat AI oplevert: houd de besparing per actie bij, zodat je ziet wat AI kost en wat het teruggeeft.",
        ],
      },
      { code: "B4", photo: photo("reimer"), title: "Kunnen AI-agents al zelfstandig betalingen tussen bedrijven afhandelen?", speaker: "Reimer Koopal", company: "AdamI", sector: "Finance", 
        summary: "Voor een adviesbureau in de betaalsector bouwde Reimer een platform waarmee honderden AI-agents tegelijk via een gewone browser bestellingen plaatsen op B2B-webshops. In zes weken zijn 800 websites getest en echte producten besteld, met elke hindernis gedocumenteerd, van cookiebanners tot captcha's.",
        takeaways: [
          "Hoe mooier, hoe moeilijker: JavaScript-animaties en creatieve titels zorgen voor ruis en verwarring bij agents.",
          "Bouw herbruikbaar en leg de lat hoog: er kan steeds meer, dus probeer ook meer.",
          "Agents die zelf aankopen doen, zijn een kwestie van tijd. Zorg dat je webshop er klaar voor is.",
        ],
      },
      { code: "B5", photo: photo("roel"), title: "AI-native engineering platform.", speaker: "Roel Rotteveel", company: "AdamI", sector: "Publieke sector", 
        summary: "Voor het COA is in vier maanden een AI-native engineering workflow gebouwd. Een AI-agent toetst elke codewijziging aan wet- en regelgeving zoals de AVG, houdt wijzigingen tegen die niet mogen en legt uit hoe het wel kan.",
        takeaways: [
          "Bouw wetgeving standaard in: toets elke wijziging automatisch, niet pas achteraf.",
          "AI als hulp, niet als risico: een agent die de kaders van juristen toepast op élke wijziging maakt software juist veiliger.",
          "Maak elke engineer AI-native, van pilotteam naar de hele organisatie, via één platform.",
        ],
      },
      { code: "B6", photo: photo("joost"), title: "Spelregels voor elke AI-agent.", speaker: "Joost Hofmann", company: "Devleaps", sector: "IT", 
        summary: "Iedere developer heeft inmiddels een eigen AI-agent, maar iedereen werkt met eigen regels. Joost liet Tempa zien: één control plane die standaarden, policies en bedrijfscontext naar elke agent stuurt en elk commando vooraf toetst, terwijl het werk gewoon op de laptop blijft.",
        takeaways: [
          "Toets tijdens het schrijven, niet pas bij de release. Begin met de open source Agent Policies en voeg je eigen do's en don'ts toe.",
          "Centraliseer regels, niet rekenkracht: standaarden, guardrails en context op één plek, het werk blijft op de laptop.",
          "Eerst adviseren, dan blokkeren: een poort met te veel valse alarmen wordt binnen een week omzeild. Meet eerst de precisie.",
        ],
      },
      { code: "B7", photo: photo("john"), title: "All-in app voor bouwers.", speaker: "John Thoelke", company: "AdamI", sector: "Bouw", 
        summary: "Een klantportaal voor een bouwmaterialengroothandel, waar een traditioneel team een jaar over zou doen, stond er in één maand. Drie engineers bouwden het met AI-agents als collega's: context in de wiki, tickets die de agent zelf oppakt en een mens die aan het roer blijft. Goed voor 130 pull requests in oktober.",
        takeaways: [
          "Context, context, context: zet wensen, besluiten uit meetings, bedrijfscontext en standaarden in de wiki.",
          "Regel toegang op dag één: accounts, rechten en tooling klaar voor de agent, net als bij een nieuwe collega.",
          "Vergeet de buitenwereld niet: plan stakeholders en het ICT-team vroeg in, zodat de agent niet stilvalt.",
        ],
      },
      { code: "B8", photo: photo("noah"), title: "Leer leerlingen weer schrijven én zet de leraar in zijn kracht. Met AI.", speaker: "Noah van Potten", company: "AdamI", sector: "Onderwijs", 
        summary: "De AI Onderwijsassistent kijkt handgeschreven werkstukken na zonder spelfouten weg te poetsen. Twee AI-modellen lezen elk werkstuk, een algoritme uit de DNA-analyse vindt waar ze verschillen, en alleen die twijfelwoorden gaan naar de docent: 97,2% nauwkeurig.",
        takeaways: [
          "Begin bij waar de uren verdwijnen: daar zit je business case, niet in de techniek.",
          "Het verschil zit in de laatste procenten: met een prompt haalt iedereen 90%, de stap naar 97% maakt van een demo een product.",
          "Geef de mens het laatste woord: maak corrigeren één klik, en mensen vertrouwen het resultaat.",
        ],
      },
    ],
  },
];

export const allDemos: Demo[] = channels.flatMap((c) => c.demos);
