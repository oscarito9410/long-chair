export const tasteKinds = ["artist", "show", "film", "book", "podcast", "game", "tag"] as const;

export type TasteKind = (typeof tasteKinds)[number];

export type TasteIcon = "note" | "screen" | "film" | "book" | "headphones" | "stack" | "pin";

export type TasteEntity = {
  id: string;
  kind: TasteKind;
  name: string;
  detail: string;
  aliases: readonly string[];
  icon: TasteIcon;
  quickStart: boolean;
};

export const TASTE_MIN = 3;
export const TASTE_MAX = 8;
export const TASTE_SEARCH_LIMIT = 8;
export const TASTE_SEARCH_DEBOUNCE_MS = 280;

export const tasteKindIcons: Record<TasteKind, TasteIcon> = {
  artist: "note",
  show: "screen",
  film: "film",
  book: "book",
  podcast: "headphones",
  game: "stack",
  tag: "pin",
};

type TasteRow = [id: string, kind: TasteKind, name: string, detail: string, aliases: string, quick: boolean];

const rows: readonly TasteRow[] = [
  ["anime", "tag", "Anime", "Series and films from Japan", "anime|animé", true],
  ["manga", "tag", "Manga", "Comics drawn for a long read", "manga", false],
  ["studio-ghibli", "film", "Studio Ghibli", "Hand-drawn films about weather and courage", "ghibli|estudio ghibli", true],
  ["shonen", "tag", "Shonen", "Adventure series with a training arc", "shonen|shōnen", false],
  ["slice-of-life", "tag", "Slice of life", "Ordinary days, drawn slowly", "slice of life", false],
  ["mecha", "tag", "Mecha", "Giant machines and their pilots", "mecha|mechas", false],
  ["magical-girl", "tag", "Magical girls", "Transformation stories and teamwork", "magical girl", false],
  ["sports-anime", "tag", "Sports anime", "A season, a team, and one more match", "deporte anime", false],
  ["gaming", "tag", "Gaming", "Games you would start again", "videojuegos|video games", true],
  ["indie-games", "tag", "Indie games", "Small studios and strange rules", "indie", false],
  ["rpgs", "tag", "RPGs", "Parties, maps, and long quests", "rpg|juegos de rol", false],
  ["speedrunning", "tag", "Speedrunning", "The same level, a little faster", "speedrun", false],
  ["cozy-games", "tag", "Cozy games", "Farms, shops, and no timer", "cozy", false],
  ["fighting-games", "tag", "Fighting games", "Rounds, rivals, and rematches", "peleas", false],
  ["fitness", "tag", "Fitness", "Training blocks and rest between them", "gym|leg day|ejercicio", true],
  ["soccer", "tag", "Soccer", "The sport, from five-a-side to a final", "futbol|fútbol|football", true],
  ["liga-mx", "tag", "Liga MX", "Mexican league weekends", "liga mx|ligamx", true],
  ["nba", "tag", "NBA", "Basketball nights and road trips", "nba|basquet|básquet", true],
  ["f1", "tag", "F1", "Race weekends and radio calls", "formula 1|formula one|fórmula 1", true],
  ["running", "tag", "Running", "Easy miles and a long route", "correr|running", false],
  ["yoga", "tag", "Yoga", "A mat, a breath, a quiet room", "yoga", false],
  ["boxing", "tag", "Boxing", "Rounds, footwork, and the bell", "boxeo", false],
  ["tennis", "tag", "Tennis", "Long rallies and clay courts", "tenis", false],
  ["cycling", "tag", "Cycling", "Climbs, teams, and a Sunday ride", "ciclismo", false],
  ["tech", "tag", "Tech", "Tools, networks, and how they are built", "technology|tecnologia|tecnología", true],
  ["science", "tag", "Science", "Questions with a method", "ciencia", false],
  ["space", "tag", "Space", "Orbits, telescopes, and launch days", "espacio", false],
  ["ai", "tag", "AI", "Models, data, and what they miss", "inteligencia artificial", false],
  ["programming", "tag", "Programming", "Languages, bugs, and small tools", "codigo|código", false],
  ["physics", "tag", "Physics", "Forces, light, and careful measurement", "fisica|física", false],
  ["true-crime", "tag", "True crime", "Cases told as reporting, not spectacle", "crimen|true crime", true],
  ["cold-cases", "tag", "Cold cases", "Files reopened years later", "casos sin resolver", false],
  ["heists", "tag", "Heists", "Plans, locks, and the getaway", "robos", false],
  ["bad-bunny", "artist", "Bad Bunny", "Reggaetón and Latin pop, sung close", "bad bunny|conejo", true],
  ["reggaeton", "tag", "Reggaetón", "Dem bows, nights out, and perreo", "reggaeton|regueton|reguetón", false],
  ["latin-pop", "tag", "Latin pop", "Choruses you already know", "pop latino", false],
  ["kpop", "tag", "K-pop", "Groups, stages, and tight choreography", "k-pop|kpop|korean pop", true],
  ["rock", "tag", "Rock", "Guitars, rooms, and a loud chorus", "rock", true],
  ["metal", "tag", "Metal", "Riffs, drums, and a long set", "metal", false],
  ["classical", "tag", "Classical", "Quartets, concertos, and small halls", "clasica|clásica|classical music", true],
  ["jazz", "tag", "Jazz", "Small rooms and a late set", "jazz", true],
  ["hip-hop", "tag", "Hip-hop", "Verses, beats, and a city", "hip hop|rap", false],
  ["salsa", "tag", "Salsa", "A floor, a horn line, and a chorus", "salsa", false],
  ["cumbia", "tag", "Cumbia", "Accordion, güira, and a dance", "cumbia", false],
  ["bolero", "tag", "Bolero", "Slow songs and a close voice", "bolero", false],
  ["cooking", "tag", "Cooking", "One recipe and the time it takes", "cocina|recipes|recetas", true],
  ["baking", "tag", "Baking", "Dough, heat, and a long rise", "hornear|reposteria|repostería", false],
  ["street-food", "tag", "Street food", "Stalls, sauces, and a short line", "comida callejera", false],
  ["coffee", "tag", "Coffee", "Beans, kettles, and a quiet cup", "cafe|café", false],
  ["telenovela", "tag", "Telenovelas", "Evenings, families, and a long plot", "novela|telenovela|soap", true],
  ["comedy", "tag", "Comedy", "Sets, sketches, and a room that laughs", "comedia", true],
  ["documentary", "tag", "Documentaries", "Reporting with a camera", "documental|docs", true],
  ["stand-up", "tag", "Stand-up", "One microphone and a crowd", "standup|stand up", false],
  ["sketch", "tag", "Sketch", "Short scenes and a returning cast", "sketch", false],
  ["reality", "tag", "Reality", "Houses, challenges, and confessionals", "reality", false],
  ["fantasy", "tag", "Fantasy", "Maps, quests, and a second world", "fantasia|fantasía", true],
  ["sci-fi", "tag", "Science fiction", "Ships, cities, and a changed rule", "ciencia ficcion|ciencia ficción|sci fi|scifi", true],
  ["mystery-novels", "tag", "Mystery novels", "A clue, a town, and a patient reader", "misterio", false],
  ["poetry", "tag", "Poetry", "Short lines you can reread", "poesia|poesía", false],
  ["essays", "tag", "Essays", "One subject, taken slowly", "ensayo", false],
  ["graphic-novels", "tag", "Graphic novels", "Stories told in panels", "novela grafica|novela gráfica", false],
  ["history", "tag", "History", "Names, dates, and the road between them", "historia", true],
  ["faith", "tag", "Faith", "Practices, questions, and quiet rooms", "fe|spirituality|espiritualidad", true],
  ["travel", "tag", "Travel", "Routes, stations, and a borrowed map", "viajes|viajar", true],
  ["ancient-history", "tag", "Ancient history", "Cities that are mostly stone now", "historia antigua", false],
  ["rail-history", "tag", "Rail history", "Lines, timetables, and small stations", "trenes", false],
  ["pilgrimage", "tag", "Pilgrimage", "A walk with a reason", "peregrinacion|peregrinación", false],
  ["cities", "tag", "Cities", "Neighborhoods and how people cross them", "ciudades", false],
  ["night-desk", "podcast", "Night Desk Audio", "A weekly hour of quiet reporting", "night desk", false],
  ["courtyard", "show", "The Courtyard", "A family story told over many evenings", "el patio", false],
  ["long-mile", "film", "The Long Mile", "A season with a distance team", "la milla", false],
  ["signal-show", "show", "Signal Room", "Engineers on a night shift", "sala de señales", false],
  ["small-hall", "artist", "Small Hall Quartet", "Four players and a wooden room", "cuarteto", false],
  ["overland", "film", "The Overland", "A train journey filmed from the window", "el viaje", false],
  ["south-road", "book", "The Long Road South", "A history of one highway", "camino del sur", false],
  ["one-pan", "podcast", "One Pan", "A single skillet and no guest", "un sarten|un sartén", false],
  ["patio-session", "artist", "Patio Session", "A live set recorded in a courtyard", "sesion de patio|sesión de patio", false],
  ["lantern-club", "show", "Lantern Club", "An after-school anime about a light festival", "club linterna", false],
  ["court-doc", "film", "Court Lines", "A sports documentary about a neighborhood court", "la cancha", false],
  ["field-notes", "book", "Field Notes on Circuits", "Short chapters about how a radio works", "circuitos", false],
  ["sunday-stands", "show", "Sunday in the Stands", "One Liga MX match, followed closely", "la tribuna", false],
  ["garden-road", "podcast", "Road to the Garden", "NBA travel days, told without the scoreboard rush", "el garden", false],
  ["wind-mill", "film", "The Wind Mill", "A hand-drawn film about a hill and a mill", "el molino", false],
  ["harbor-quest", "game", "Harbor Quest", "A small quest game set in a port", "harbor quest", false],
  ["five-a-side", "game", "Five a Side", "A pickup soccer game you can finish in an hour", "futbol 5|fútbol 5", false],
  ["seoul-lights", "artist", "Seoul Lights", "A K-pop group with a bright chorus", "seoul", false],
  ["iron-orchard", "artist", "Iron Orchard", "A metal band that records live", "iron orchard", false],
  ["calle-oro", "artist", "Calle Oro", "A salsa orchestra from a side street", "calle oro", false],
  ["glass-orbit", "book", "Glass Orbit", "A science-fiction novel about a quiet station", "orbita|órbita", false],
  ["second-map", "book", "The Second Map", "A fantasy novel that starts with a wrong turn", "el segundo mapa", false],
  ["quiet-questions", "podcast", "Quiet Questions", "Conversations about practice and belief", "preguntas", false],
  ["names-on-map", "podcast", "Names on the Map", "History told as a walk", "nombres", false],
  ["second-mic", "film", "The Second Microphone", "A comedy concert film in a small theater", "el microfono|el micrófono", false],
  ["open-water", "film", "Open Water Notes", "A documentary about a research boat", "agua abierta", false],
  ["mira-solano", "artist", "Mira Solano", "Warm vocal jazz in small rooms", "mira", false],
  ["harbor-lights", "show", "Harbor Lights", "A coastal mystery, told quietly", "harbor", false],
  ["paper-kite", "film", "The Paper Kite", "A slow road film about a repair", "paper kite|el papalote", false],
  ["salt-windowlight", "book", "Salt and Windowlight", "Essays on kitchens and weather", "windowlight", false],
  ["slow-kitchen", "podcast", "Slow Kitchen Radio", "One recipe, and no rush", "slow kitchen", false],
  ["sunday-engines", "film", "Sunday Engines", "A gentle film about small trains", "sunday engines", false],
];

function entityFromRow(row: TasteRow): TasteEntity {
  const [id, kind, name, detail, aliases, quickStart] = row;
  return {
    id,
    kind,
    name,
    detail,
    aliases: aliases.length === 0 ? [] : aliases.split("|"),
    icon: tasteKindIcons[kind],
    quickStart,
  };
}

export const tasteCatalog: readonly TasteEntity[] = rows.map(entityFromRow);

const byId = new Map(tasteCatalog.map((taste) => [taste.id, taste]));

export function tasteById(id: string): TasteEntity | undefined {
  return byId.get(id);
}

export const quickStartTastes: readonly TasteEntity[] = tasteCatalog.filter((taste) => taste.quickStart);

export function foldTasteText(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

export function searchTasteCatalog(query: string, limit = TASTE_SEARCH_LIMIT): readonly TasteEntity[] {
  const needle = foldTasteText(query);
  if (needle.length < 2) {
    return [];
  }
  const hits: TasteEntity[] = [];
  for (const taste of tasteCatalog) {
    const fields = [taste.name, taste.detail, ...taste.aliases];
    const matched = fields.some((field) => foldTasteText(field).includes(needle));
    if (matched) {
      hits.push(taste);
    }
    if (hits.length >= limit) {
      break;
    }
  }
  return hits;
}

export function tastePickLabel(count: number): string {
  if (count < TASTE_MIN) {
    return `${count} of ${TASTE_MIN} picked`;
  }
  if (count === TASTE_MIN) {
    return `${TASTE_MIN} of ${TASTE_MIN} picked`;
  }
  return `${count} picked`;
}

export function toggleTaste(ids: readonly string[], id: string, max = TASTE_MAX): string[] {
  if (ids.includes(id)) {
    return ids.filter((item) => item !== id);
  }
  if (ids.length >= max) {
    return [...ids];
  }
  return [...ids, id];
}

export function canContinueTastes(count: number): boolean {
  return count >= TASTE_MIN && count <= TASTE_MAX;
}

export const welcomeTasteExamples = [
  "anime nights",
  "leg day",
  "true crime",
  "Bad Bunny",
  "Studio Ghibli",
  "F1 races",
  "Liga MX",
  "Sunday jazz",
] as const;

const WELCOME_NOTE_COUNT = 4;

export function welcomeNotesAt(step: number): readonly string[] {
  const count = welcomeTasteExamples.length;
  const notes: string[] = [];
  for (let offset = 0; offset < WELCOME_NOTE_COUNT; offset += 1) {
    const index = ((step + offset) % count + count) % count;
    const note = welcomeTasteExamples[index];
    if (note) {
      notes.push(note);
    }
  }
  return notes;
}

export const tasteSearchPlaceholder = "Anime, a band, a show, a sport…";
