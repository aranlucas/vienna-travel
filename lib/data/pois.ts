import type { Coordinates } from './trip'

export interface PointOfInterest {
  id: string
  name: string
  coordinates: Coordinates
  description: string
  googleMapsUrl?: string
  warning?: string
  tip?: string
  icon?: 'culture' | 'food' | 'nature' | 'hotel' | 'transport'
}

type POIData = PointOfInterest & { phaseId: string }

export const POIS: Record<string, POIData> = {
  // ── Vienna ──────────────────────────────────────────────────────────────────
  'vienna-hotel': {
    id: 'vienna-hotel',
    name: 'Vienna City Hotel',
    coordinates: { lat: 48.2082, lng: 16.3738 },
    description: 'Fictional lodging marker near central Vienna.',
    icon: 'hotel',
    phaseId: 'vienna',
  },
  naschmarkt: {
    id: 'naschmarkt',
    name: 'Naschmarkt',
    coordinates: { lat: 48.199, lng: 16.3654 },
    description: "Vienna's famous open-air market. Buy hiking supplies: nuts, dried fruits, alpine cheese.",
    warning: 'CLOSED Sundays — visit on Sept 5 only!',
    icon: 'food',
    phaseId: 'vienna',
  },
  stadtpark: {
    id: 'stadtpark',
    name: 'Stadtpark',
    coordinates: { lat: 48.2022, lng: 16.3792 },
    description:
      'Historic city park near your hotel, ideal for a low-effort stroll and the classic Johann Strauss monument photo.',
    icon: 'nature',
    phaseId: 'vienna',
  },
  karlskirche: {
    id: 'karlskirche',
    name: 'Karlskirche',
    coordinates: { lat: 48.1981, lng: 16.3715 },
    description:
      "One of Vienna's most striking Baroque churches, right by Karlsplatz and an easy add-on to the Naschmarkt / Belvedere side of town.",
    icon: 'culture',
    phaseId: 'vienna',
  },
  stephansdom: {
    id: 'stephansdom',
    name: "St. Stephen's Cathedral",
    coordinates: { lat: 48.2085, lng: 16.3731 },
    description: "Gothic masterpiece at the heart of Vienna's historic center.",
    googleMapsUrl:
      'https://www.google.com/maps/place/St.+Stephen%27s+Cathedral/@48.2084113,16.3685998,16z/data=!3m2!4b1!5s0x476d079f9dbbb573:0x1d6dc1f6c15851df!4m6!3m5!1s0x476d079f223feccf:0x179757f3fadc3159!8m2!3d48.2084114!4d16.3734707!16zL20vMDFmZG1q?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D',
    icon: 'culture',
    phaseId: 'vienna',
  },
  'vienna-state-opera': {
    id: 'vienna-state-opera',
    name: 'Vienna State Opera',
    coordinates: { lat: 48.2029, lng: 16.3687 },
    description:
      "Ringstraße icon and one of the city's defining cultural landmarks. Strong stop even without a performance ticket.",
    googleMapsUrl:
      'https://www.google.com/maps/place/Opernring%2B2%2C%2B1010%2BWien%2C%2BAustria/data%3D%214m2%213m1%211s0x476d079c861dbfd5%3A0xfd59268d25377d56?gl=US&hl=en',
    icon: 'culture',
    phaseId: 'vienna',
  },
  albertina: {
    id: 'albertina',
    name: 'Albertina',
    coordinates: { lat: 48.2044, lng: 16.3687 },
    description:
      'Top-tier museum beside the Opera with a strong permanent collection and an easy fit on the imperial-center walk.',
    googleMapsUrl:
      'https://www.google.com/maps/place/Albertinapl.%2B1%2C%2B1010%2BWien%2C%2BAustria/data%3D%214m2%213m1%211s0x476d079bf27e5ac1%3A0x66ef8a989f37deb8?gl=US&hl=en',
    icon: 'culture',
    phaseId: 'vienna',
  },
  burggarten: {
    id: 'burggarten',
    name: 'Burggarten',
    coordinates: { lat: 48.2049, lng: 16.3661 },
    description:
      'Compact inner-city garden between the Opera and Hofburg, good for a breather during the Ringstraße loop.',
    icon: 'nature',
    phaseId: 'vienna',
  },
  hofburg: {
    id: 'hofburg',
    name: 'Hofburg Imperial Palace',
    coordinates: { lat: 48.2065, lng: 16.364 },
    description:
      'The Habsburg imperial core. Best fit for the "Imperial Vienna" day and more central than trying to force every palace into one walk.',
    googleMapsUrl:
      'https://www.google.com/maps/place/Heldenplatz%2C%2B1010%2BWien%2C%2BAustria/data%3D%214m2%213m1%211s0x476d0799bf2006df%3A0x3e5339ad2c514e60?gl=US&hl=en',
    icon: 'culture',
    phaseId: 'vienna',
  },
  'cafe-central': {
    id: 'cafe-central',
    name: 'Café Central',
    coordinates: { lat: 48.2098, lng: 16.3669 },
    description: 'A legendary Viennese coffeehouse. Order a Melange and soak in the atmosphere.',
    icon: 'food',
    phaseId: 'vienna',
  },
  schoenbrunn: {
    id: 'schoenbrunn',
    name: 'Schönbrunn Palace',
    coordinates: { lat: 48.1845, lng: 16.3122 },
    description: 'Habsburg summer palace with 1,441 rooms and immaculate formal gardens. Open Sundays.',
    googleMapsUrl:
      'https://www.google.com/maps/place/Sch%C3%B6nbrunner%2BSchlo%C3%9Fstra%C3%9Fe%2B47%2C%2B1130%2BWien%2C%2BAustria/data%3D%214m2%213m1%211s0x476da8091cc07cbf%3A0x4e69ba5de4ea8bc9?gl=US&hl=en',
    icon: 'culture',
    phaseId: 'vienna',
  },
  belvedere: {
    id: 'belvedere',
    name: 'Belvedere Museum',
    coordinates: { lat: 48.1907, lng: 16.3816 },
    description: "Baroque palace housing Klimt's 'The Kiss.' Open Sundays.",
    icon: 'culture',
    phaseId: 'vienna',
  },
  grinzing: {
    id: 'grinzing',
    name: 'Grinzing Heuriger',
    coordinates: { lat: 48.2614, lng: 16.3528 },
    description: 'Traditional Viennese wine tavern district. Enjoy Grüner Veltliner with locals.',
    icon: 'food',
    phaseId: 'vienna',
  },
  peterskirche: {
    id: 'peterskirche',
    name: "St. Peter's Church (Peterskirche)",
    coordinates: { lat: 48.2094, lng: 16.3695 },
    description:
      'Baroque church tucked just off Graben, with a striking dome, ornate interior, and free organ concerts most afternoons. A quiet respite between Stephansdom and the Hofburg.',
    tip: 'Open Sundays for High Mass — a strong fit if shops are closed and you want an atmospheric stop between the Ringstraße walk and Café Central.',
    icon: 'culture',
    phaseId: 'vienna',
  },
  'wiener-riesenrad': {
    id: 'wiener-riesenrad',
    name: 'Wiener Riesenrad (Giant Ferris Wheel)',
    coordinates: { lat: 48.2163, lng: 16.3955 },
    description:
      "Vienna's landmark ferris wheel in the Prater. Sunset and evening rides give the best city panoramas; September hours run 9:00 AM–10:45 PM.",
    tip: 'Book online in advance and aim for the sunset/blue-hour slot after dinner — either Sept 5 or Sept 6 evening can slot in easily from the Ring.',
    icon: 'culture',
    phaseId: 'vienna',
  },
  ankeruhr: {
    id: 'ankeruhr',
    name: 'Ankeruhr Anchor Clock',
    coordinates: { lat: 48.2114, lng: 16.3748 },
    description:
      'Art Nouveau mechanical clock at Hoher Markt. Twelve historical figures parade across the face — at noon all twelve appear together in sequence.',
    tip: 'Time a 5-minute stop for noon on either Vienna day for the full figure parade — just off the Stephansdom → Ring walk.',
    icon: 'culture',
    phaseId: 'vienna',
  },

  // ── Salzkammergut ────────────────────────────────────────────────────────────
  mondsee: {
    id: 'mondsee',
    name: 'Mondsee',
    coordinates: { lat: 47.8556, lng: 13.349 },
    description: 'The "Sound of Music" church. Beautiful lakeside town en route from Salzburg.',
    icon: 'culture',
    phaseId: 'salzkammergut',
  },
  attersee: {
    id: 'attersee',
    name: 'Attersee',
    coordinates: { lat: 47.9195, lng: 13.5307 },
    description: "Austria's largest lake. Deep turquoise water, perfect for a lunch stop.",
    icon: 'nature',
    phaseId: 'salzkammergut',
  },
  hallstatt: {
    id: 'hallstatt',
    name: 'Hallstatt',
    coordinates: { lat: 47.5622, lng: 13.6493 },
    description: 'UNESCO World Heritage village clinging to a clifftop above a mirror lake.',
    tip: 'Arrive by 7:30 AM, explore the old town first, then be at the rebuilt Salzbergbahn for the 9:00 AM first ascent. The Skywalk is uphill and reached by funicular; do not plan to walk there before opening.',
    icon: 'nature',
    phaseId: 'salzkammergut',
  },
  'hallstatt-evangelical-church': {
    id: 'hallstatt-evangelical-church',
    name: 'Hallstatt Evangelical Church',
    coordinates: { lat: 47.5615, lng: 13.6495 },
    description: "The postcard church on the lakefront in Hallstatt's compact old town.",
    icon: 'culture',
    phaseId: 'salzkammergut',
  },
  'lakeside-stay': {
    id: 'lakeside-stay',
    name: 'Lakeside Guesthouse',
    coordinates: { lat: 47.7377, lng: 13.4437 },
    description: 'Fictional lakeside lodging marker in St. Wolfgang.',
    tip: 'A convenient lakeside base for the early Hallstatt start and the afternoon mountain railway.',
    icon: 'hotel',
    phaseId: 'salzkammergut',
  },
  'st-gilgen': {
    id: 'st-gilgen',
    name: 'St. Gilgen',
    coordinates: { lat: 47.7668, lng: 13.3664 },
    description: 'Charming lakeside village on the Wolfgangsee.',
    icon: 'nature',
    phaseId: 'salzkammergut',
  },
  'st-wolfgang': {
    id: 'st-wolfgang',
    name: 'St. Wolfgang',
    coordinates: { lat: 47.7377, lng: 13.4437 },
    description: 'Departure point for the Schafbergbahn cog railway.',
    icon: 'transport',
    phaseId: 'salzkammergut',
  },
  schafberg: {
    id: 'schafberg',
    name: 'Schafberg Summit',
    coordinates: { lat: 47.7735, lng: 13.4628 },
    description: '5,850 ft summit with panoramic views over 7 lakes. Reached by historic steam cog railway.',
    tip: 'The sample itinerary assumes a reserved time slot. Verify live availability and operating conditions.',
    icon: 'nature',
    phaseId: 'salzkammergut',
  },
  'klimt-zentrum': {
    id: 'klimt-zentrum',
    name: 'Klimt-Zentrum am Attersee',
    coordinates: { lat: 47.9494, lng: 13.5892 },
    description:
      "Museum in Schörfling devoted to Gustav Klimt's Attersee summers (1900–1916) — the region inspired most of his landscape paintings.",
    tip: 'Check current seasonal opening dates and hours before including this stop.',
    icon: 'culture',
    phaseId: 'salzkammergut',
  },
  'bad-ischl': {
    id: 'bad-ischl',
    name: 'Bad Ischl — Kaiservilla',
    coordinates: { lat: 47.7117, lng: 13.6236 },
    description:
      "Imperial spa town and 2024 European Capital of Culture. Franz Joseph's summer villa, the Marmorschlössl, and Konditorei Zauner are all walkable from the center.",
    tip: 'Sits naturally between St. Wolfgang and Hallstatt — a good morning coffee + Zauner pastry stop if you leave the hotel before the Sept 8 Hallstatt early start.',
    icon: 'culture',
    phaseId: 'salzkammergut',
  },
  'salzwelten-hallstatt': {
    id: 'salzwelten-hallstatt',
    name: 'Salzwelten Hallstatt Salt Mine',
    coordinates: { lat: 47.5558, lng: 13.6495 },
    description:
      "The world's oldest salt mine plus the Skywalk 'World Heritage View' deck — a V-shaped platform 40 ft over the cliff, 1,181 ft above the village roofs.",
    tip: 'Verify the current funicular, Skywalk, and mine-tour options before using this sample timing.',
    icon: 'nature',
    phaseId: 'salzkammergut',
  },

  // ── Tyrol ────────────────────────────────────────────────────────────────────
  'ehrwald-base': {
    id: 'ehrwald-base',
    name: 'Tyrol Mountain Hotel',
    coordinates: { lat: 47.4009, lng: 10.916 },
    description: 'Fictional lodging marker for the sample Tyrol phase.',
    tip: 'Mountain base in Ehrwald, convenient for the early gondola start.',
    icon: 'hotel',
    phaseId: 'tyrol',
  },
  highline179: {
    id: 'highline179',
    name: 'Highline 179',
    coordinates: { lat: 47.4851, lng: 10.7198 },
    description:
      "World's longest pedestrian suspension bridge (1,332 ft). Swings between a medieval castle and a hilltop fort.",
    icon: 'nature',
    phaseId: 'tyrol',
  },
  plansee: {
    id: 'plansee',
    name: 'Plansee',
    coordinates: { lat: 47.4532, lng: 10.7372 },
    description: 'Deep blue fjord-like lake. Its narrow shape and towering cliffs feel like a Norwegian fjord.',
    icon: 'nature',
    phaseId: 'tyrol',
  },
  ehrwald: {
    id: 'ehrwald',
    name: 'Ehrwalder Almbahn',
    coordinates: { lat: 47.4063, lng: 10.9081 },
    description: 'Gondola base station. Start here for the Seebensee & Drachensee hike.',
    icon: 'transport',
    phaseId: 'tyrol',
  },
  zugspitze: {
    id: 'zugspitze',
    name: 'Zugspitze Summit',
    coordinates: { lat: 47.4211, lng: 10.9854 },
    description:
      '9,718 ft — the highest peak in the Alps accessible by the Tiroler Zugspitzbahn. Cross into Germany at the top!',
    tip: 'Take the Tiroler Zugspitzbahn from Ehrwald. The border with Germany runs across the summit plateau.',
    icon: 'nature',
    phaseId: 'tyrol',
  },
  blindsee: {
    id: 'blindsee',
    name: 'Blindsee',
    coordinates: { lat: 47.4193, lng: 10.9387 },
    description:
      'Famous for its otherworldly turquoise water and submerged "ghost trees" — dead trunks standing in the lake.',
    icon: 'nature',
    phaseId: 'tyrol',
  },
  fernsteinsee: {
    id: 'fernsteinsee',
    name: 'Fernsteinsee',
    coordinates: { lat: 47.3458, lng: 10.8225 },
    description:
      'Emerald-green lake just off the Fern Pass (B179) with a postcard island chapel. A quick photo stop on the way from the lakes to Ehrwald.',
    tip: 'Roadside pull-off is small — plan on 15 minutes max and skip in poor weather since the color is what makes it.',
    icon: 'nature',
    phaseId: 'tyrol',
  },

  // ── Olperer ──────────────────────────────────────────────────────────────────
  schlegeis: {
    id: 'schlegeis',
    name: 'Schlegeis Reservoir',
    coordinates: { lat: 47.0357, lng: 11.6637 },
    description: 'Dramatic alpine reservoir at 5,846 ft. Starting point for the Olpererhütte hike.',
    tip: 'Tolls and access rules change. Check the current road, weather, parking, and traffic-control status before driving.',
    icon: 'nature',
    phaseId: 'olperer',
  },
  olpererhuette: {
    id: 'olpererhuette',
    name: 'Olpererhütte',
    coordinates: { lat: 47.0419, lng: 11.6569 },
    description: '7,835 ft mountain hut famous for its photogenic suspension bridge with Schlegeis Reservoir backdrop.',
    tip: 'Bring €100+ cash — card machines unreliable at altitude.',
    icon: 'nature',
    phaseId: 'olperer',
  },
  'innsbruck-golden-roof': {
    id: 'innsbruck-golden-roof',
    name: 'Innsbruck — Golden Roof',
    coordinates: { lat: 47.2683, lng: 11.3933 },
    description: "Innsbruck's medieval Old Town. The Golden Roof (Goldenes Dachl) is the city's iconic landmark.",
    tip: 'On Sept 13, store bags at Hbf lockers or the hotel before the old-town walk. The rental car is already scheduled for return at Innsbruck Airport on Sept 12.',
    icon: 'culture',
    phaseId: 'olperer',
  },
  'innsbruck-st-anne': {
    id: 'innsbruck-st-anne',
    name: "St. Anne's Column",
    coordinates: { lat: 47.2662, lng: 11.3921 },
    description: 'The landmark column on Maria-Theresien-Straße and a clean anchor for the old-town stroll.',
    icon: 'culture',
    phaseId: 'olperer',
  },
  'innsbruck-hofburg': {
    id: 'innsbruck-hofburg',
    name: 'Innsbruck Hofburg',
    coordinates: { lat: 47.2693, lng: 11.3957 },
    description: 'Imperial Palace at the edge of the Old Town, an easy continuation after the Golden Roof.',
    icon: 'culture',
    phaseId: 'olperer',
  },
  'innsbruck-nordkette': {
    id: 'innsbruck-nordkette',
    name: 'Nordkette — Top of Innsbruck',
    coordinates: { lat: 47.3125, lng: 11.3833 },
    description:
      'Three-stage lift (Hungerburgbahn funicular + two cable cars) from the Congress station to the 2,256 m Hafelekar ridge. ~20 min each way, 360° views over the Karwendel range.',
    tip: 'Sept hours: Seegrube 08:30–18:30, Hafelekar 09:00–18:00. Entire round trip is ~60 min + time at the top. If Sept 13 morning is clear, this is the cleanest "one more view" add-on before the 14:56 train — Congress station is 5 min from the Golden Roof.',
    icon: 'nature',
    phaseId: 'olperer',
  },
  'swarovski-kristallwelten': {
    id: 'swarovski-kristallwelten',
    name: 'Swarovski Kristallwelten (Wattens)',
    coordinates: { lat: 47.2902, lng: 11.5961 },
    description:
      'Crystal-themed art installations, the "Crystal Cloud" with 800,000 hand-set crystals, and Chambers of Wonder. 20 km east of Innsbruck, 30-min shuttle from Hbf Bus Terminal C.',
    warning:
      'Needs 2–4 hours on site. Probably too tight against the Sept 13 14:56 RJX departure — treat as a Plan B only if the Nordkette is weathered out and you skip the old-town stroll.',
    icon: 'culture',
    phaseId: 'olperer',
  },
  'airport-hotel': {
    id: 'airport-hotel',
    name: 'Vienna Airport Hotel',
    coordinates: { lat: 48.1103, lng: 16.5697 },
    description: 'Airport hotel for the final overnight, directly by the terminal.',
    icon: 'hotel',
    phaseId: 'olperer',
  },
  'vie-airport': {
    id: 'vie-airport',
    name: 'Vienna Airport (VIE)',
    coordinates: { lat: 48.1103, lng: 16.5697 },
    description: 'The sample airport hotel is shown near the terminal for the final overnight.',
    icon: 'transport',
    phaseId: 'olperer',
  },
}
