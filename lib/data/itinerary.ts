import type { Coordinates } from './trip'

export type ActivityType = 'activity' | 'hike' | 'drive' | 'flight' | 'train'

export interface DayActivity {
  /** Structured time, e.g. '8:30 AM'. Undefined for untimed/evening activities. */
  time?: string
  /** Activity description without any time prefix. */
  title: string
  details?: string[]
  links?: { label: string; href: string }[]
  highlight?: 'important' | 'fun'
  /** Timeline event type — defaults to 'activity' if omitted. */
  type?: ActivityType
  /**
   * Links this activity to a DRIVING_SEGMENTS or FLIGHT_SEGMENTS entry by id.
   * The timeline consolidates: activity title + segment metadata → one event.
   * The segment's own loop entry is suppressed when claimed.
   */
  segmentId?: string
}

export interface DayRoute {
  label: string
  coordinates: Coordinates[]
}

export interface DayWeatherLocation {
  name: string
  coordinates: Coordinates
  /** Explicit elevation for high-alpine forecast downscaling. */
  elevationM?: number
}

export interface DayWeatherWindow {
  /** Human-readable activity window at the forecast point. */
  label: string
  /** Inclusive local hours in Europe/Vienna time. */
  startHour: number
  endHour: number
}

export interface WeatherExposureForecast extends DayWeatherWindow {
  highC: number
  lowC: number
  feelsHighC?: number
  feelsLowC?: number
  precipPct?: number
  precipMm?: number
  windKph?: number
  gustKph?: number
}

export interface DayPlan {
  isoDate: string
  date: string
  dayLabel: string
  title: string
  /** Which phase this day belongs to. */
  phaseId: string
  recommendation?: string
  alternative?: string
  alternativeLinks?: { label: string; href: string }[]
  activities: DayActivity[]
  weather?: string
  weatherNote?: string
  weatherSource?: 'historical' | 'forecast'
  weatherLocation?: DayWeatherLocation
  /** Hours when the itinerary is actually exposed at weatherLocation. */
  weatherWindow?: DayWeatherWindow
  /** Structured forecast data — populated by resolveDaysWeather when live. */
  weatherHighC?: number
  weatherLowC?: number
  weatherFeelsHighC?: number
  weatherFeelsLowC?: number
  weatherPrecipPct?: number
  weatherPrecipMm?: number
  weatherPrecipHours?: number
  weatherCode?: number
  weatherWindKph?: number
  weatherGustKph?: number
  weatherWindDirectionDeg?: number
  weatherUvMax?: number
  weatherSunrise?: string
  weatherSunset?: string
  /** Days between the forecast run and this trip day. */
  weatherForecastLeadDays?: number
  /** Hourly forecast aggregated across weatherWindow. */
  weatherExposure?: WeatherExposureForecast
  /** Label shown when the day is still outside the forecast window, e.g. 'Live forecast opens Sep 2'. */
  weatherUnlocks?: string
  accommodation?: string
  notes?: string
  carryToday?: string[]
}

/** All trip days, keyed by ISO date. */
export const DAYS: Record<string, DayPlan> = {
  '2026-09-05': {
    isoDate: '2026-09-05',
    date: 'Sept 5',
    dayLabel: 'Day 1 — Saturday',
    title: 'Arrival & Easy Evening',
    phaseId: 'vienna',
    recommendation:
      'Keep arrival gentle: hotel, dinner nearby and a short Stadtpark stroll. Save sightseeing energy for Sunday.',
    alternative:
      'If the flight or baggage is delayed, go straight to the hotel and eat nearby; supermarket shopping is optional.',
    activities: [
      {
        time: '4:35 PM',
        title: 'Land at VIE (OS186 / LH6390 codeshare via MUC); baggage claim and customs ~30 min',
        highlight: 'important',
      },
      {
        time: '5:15 PM',
        title: 'Buy hiking snacks at an open VIE or Wien Mitte supermarket; do not depend on Naschmarkt stalls',
        highlight: 'important',
      },
      {
        time: '5:45 PM',
        title: 'CAT or S7 train to Wien Mitte, then walk/taxi to the hotel',
        details: [
          'CAT journey is 16 minutes; allow extra time for tickets, waiting and the final hotel transfer. S7 is the public-rail alternative; check its actual departure and fare. Arrival-day times are planning estimates, not a record of completed travel.',
        ],
        links: [
          { label: 'Airport rail options', href: 'https://www.viennaairport.com/en/passengers/arrival__parking' },
        ],
        highlight: 'important',
      },
      { time: '6:15 PM', title: 'Check in at Almanac Palais Vienna in the city centre', highlight: 'important' },
      {
        time: '7:00 PM',
        title: 'Dinner near the hotel or at a Naschmarkt restaurant if energy allows',
        highlight: 'fun',
      },
      {
        time: '8:30 PM',
        title: 'Optional easy loop through Stadtpark before returning to the hotel',
        highlight: 'fun',
      },
    ],
    weather: 'Vienna typical early-September weather: around 21°C / 70°F by day and 14°C / 57°F at night.',
    weatherNote: 'Light city layers work well. You likely only need a light jacket after dark.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Vienna', coordinates: { lat: 48.2082, lng: 16.3738 } },
    accommodation: 'Almanac Palais Vienna',
    notes:
      'Naschmarkt market stalls close by 6:00 PM Saturday and are not a reliable arrival-day supply stop. Restaurants may operate later and some open Sunday.',
    carryToday: ['Passport and arrival docs', 'Light city layer', 'Reusable tote for market snacks', 'Phone charger'],
  },

  '2026-09-06': {
    isoDate: '2026-09-06',
    date: 'Sept 6',
    dayLabel: 'Day 2 — Sunday',
    title: 'Palaces & Wine',
    phaseId: 'vienna',
    recommendation:
      'Spend the morning at Kunsthistorisches Museum (KHM): its imperial art collection and grand interiors make it my first choice for this short Vienna visit. Follow it with a relaxed walk around the Hofburg.',
    alternative:
      'Grinzing is an optional evening excursion. A central dinner is the better choice if the museum and walking day already feels full.',
    activities: [
      {
        time: '9:00 AM',
        title: 'Breakfast at the hotel (daily breakfast included)',
        highlight: 'fun',
      },
      {
        time: '10:00 AM',
        title: 'Visit Kunsthistorisches Museum — the morning’s main experience',
        details: [
          'Recommended: KHM for its imperial art collection and grand interiors. Allow 2–3 hours, focusing on the Picture Gallery rather than trying to see every collection. Sunday hours are 10:00–18:00; admission is paid.',
          'Alternative: choose Wien Museum Karlsplatz if you prefer the story of Vienna and a free permanent collection. Its Sunday hours are also 10:00–18:00. This replaces KHM; leave the afternoon free for the city walk.',
        ],
        links: [
          { label: 'KHM hours and tickets', href: 'https://www.khm.at/en/visit' },
          { label: 'Wien Museum visitor information', href: 'https://www.wienmuseum.at/besucherinformation' },
        ],
        highlight: 'fun',
      },
      { time: '1:00 PM', title: 'Lunch near the chosen museum, then walk toward the Ring', highlight: 'important' },
      {
        time: '2:30 PM',
        title: 'Ringstraße core walk: Opera → Albertina exterior → Burggarten → Hofburg (~2 hrs, easy stroll)',
        highlight: 'fun',
      },
      { time: '5:00 PM', title: 'Coffee and cake in the centre; skip a long café queue', highlight: 'fun' },
      { time: '6:30 PM', title: 'Optional Grinzing dinner, or stay near the hotel if tired', highlight: 'fun' },
      { time: '9:00 PM', title: "Return to Almanac; pack for tomorrow's checkout", highlight: 'important' },
    ],
    weather: 'Vienna again: typically about 21°C / 70°F high and 14°C / 57°F low.',
    weatherNote:
      'Comfortable walking weather, but carry a light layer for the evening and any windy tram or wine-hill stop.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Vienna', coordinates: { lat: 48.2082, lng: 16.3738 } },
    accommodation: 'Almanac Palais Vienna',
    notes:
      'Important correction: Vienna does not have a blanket first-Sunday-free rule for federal museums. The first-Sunday offer applies to the Wien Museum network; KHM, Albertina, Belvedere, NHM, MAK, and Weltmuseum use their normal admission rules. Checkout Monday Sept 7 at noon.',
    carryToday: ['Water bottle', 'Church-ready light layer', 'Museum tickets or booking emails', 'Compact umbrella'],
  },

  '2026-09-07': {
    isoDate: '2026-09-07',
    date: 'Sept 7',
    dayLabel: 'Day 3 — Monday',
    title: 'Transit to the Turquoise Lakes',
    phaseId: 'salzkammergut',
    recommendation:
      'Make reaching Wolfgangsee the priority. Mondsee is the natural short stop; skip the Attersee detour if it delays a relaxed lakeside evening.',
    alternative:
      'After a late train or rental pickup, drive directly to St. Wolfgang and settle in. The lake is the experience, not the number of road stops.',
    activities: [
      {
        time: '7:00 AM',
        title: 'Breakfast at the hotel, check out, and confirm the Railjet platform in the ÖBB app',
        highlight: 'important',
      },
      {
        time: '7:45 AM',
        title: 'Taxi to Wien Hbf; choose a Railjet reaching Salzburg by 11:00 AM',
        details: [
          'Allow 20–30 minutes for the taxi plus station boarding buffer; walking is not a 15-minute alternative. No exact outbound train is confirmed in the trip record. Protect the noon rental collection and shorten lake stops if delayed.',
        ],
        links: [{ label: 'ÖBB live journey planner', href: 'https://fahrplan.oebb.at/' }],
        highlight: 'important',
      },
      {
        time: '8:30 AM',
        title: 'Take a morning Railjet from Wien Hbf to Salzburg',
        type: 'train',
        segmentId: 'vienna-salzburg-rail',
        details: [
          '08:30 is a planning target, not a verified departure. Select a service arriving by 11:00 for the noon rental pickup.',
        ],
        links: [{ label: 'Select the morning service', href: 'https://fahrplan.oebb.at/' }],
      },
      {
        time: '12:00 PM',
        title: 'Pick up confirmed SIXT rental at Salzburg Centre/RadissonBlu (near Hbf)',
        highlight: 'important',
      },
      {
        time: '12:30 PM',
        title: 'Drive to Mondsee (~25 min) — visit the Sound of Music church',
        highlight: 'fun',
        type: 'drive',
        segmentId: 'salzburg-to-lakes',
      },
      {
        time: '1:30 PM',
        title: 'Optional Attersee lunch stop if running on time',
        details: [
          'Keep this to one lake stop after Mondsee. Omit Attersee if rental collection is delayed; Zimmerbräu check-in ends at 18:00.',
        ],
        highlight: 'fun',
      },
      {
        time: '3:00 PM',
        title: 'Continue to St. Wolfgang; check in before 6:00 PM',
        details: [
          'Allow 45–60 minutes from the Attersee area depending on your stop and traffic. This is a planning buffer, not a live route estimate.',
        ],
        highlight: 'important',
      },
      { time: '6:30 PM', title: 'Stroll the St. Wolfgang lakefront', highlight: 'fun' },
    ],
    weather:
      'St. Wolfgang / lake district typical September weather: around 20°C / 68°F by day and 10°C / 50°F at night.',
    weatherNote:
      'This card follows the lake destination rather than Salzburg. Keep a shell accessible during the drive and a light layer ready for the lakefront evening.',
    weatherSource: 'historical',
    weatherLocation: { name: 'St. Wolfgang', coordinates: { lat: 47.7377, lng: 13.4437 } },
    accommodation: 'Hotel Zimmerbräu, St. Wolfgang',
    notes:
      'The SIXT rental pickup is confirmed for 12:00 PM at Salzburg Centre/RadissonBlu. Preserve at least 45 minutes between scheduled train arrival and pickup, and confirm the Austrian vignette is active before leaving.',
    carryToday: [
      'Train tickets and ID',
      'Rental car pickup documents',
      'Light fleece for lake evening',
      'Snacks for the transfer day',
    ],
  },

  '2026-09-08': {
    isoDate: '2026-09-08',
    date: 'Sept 8',
    dayLabel: 'Day 4 — Tuesday',
    title: 'Schafberg Red Train · Bike & Swim',
    phaseId: 'salzkammergut',
    recommendation:
      'Best combination: Schafbergbahn in the morning, then an easy afternoon e-bike ride to Strobl with a proper swim break. Prefer Pro Travel if they confirm the bikes; See-Biker is the convenient walk-in backup.',
    alternative:
      'If the summit is clouded in, skip the railway and spend longer by the lake. If afternoon storms develop, shorten the ride and leave the water before thunder; do not replace the swim with more exposed riding.',
    activities: [
      {
        time: '8:00 AM',
        title: 'Breakfast; pack summit layers and a separate swim bag',
        details: [
          'All September 8 activities are planned, not reserved. Published schedules and prices checked September 7, 2026; availability can change.',
        ],
      },
      {
        time: '8:30 AM',
        title: 'Walk to Schafbergbahn valley station; arrive by 8:45 AM',
        details: [
          'Allow 15 minutes from central St. Wolfgang plus 30 minutes for tickets, toilets and boarding. Walking time is a planning allowance.',
          'Book the 9:15 ascent and 12:05 descent together. Adult return fare: €61 (€122 for two). The 8:50 seasonal departure ends September 6 and is not the September 8 plan.',
        ],
        links: [
          {
            label: 'Train tickets & operating status',
            href: 'https://www.5schaetze.at/en/Info_SchafbergBahn_and_WolfgangseeSchifffahrt.html',
          },
          { label: 'Summit webcam', href: 'https://schafberg.panomax.com/' },
        ],
      },
      {
        time: '9:15 AM',
        title: 'Planned Schafbergbahn ascent → summit at 9:50 AM',
        type: 'train',
        segmentId: 'schafberg-ascent',
        highlight: 'fun',
      },
      {
        time: '9:50 AM',
        title: 'Schafberg panorama, short summit walk and coffee',
        details: [
          'Allow about 15 minutes and 50 m ascent from the station toward Hotel Schafbergspitze / Himmelspforte. Stay on signed paths; this is a viewpoint visit, not a mountain descent hike.',
          'Enjoy the lake panorama, then return to the mountain station by 11:45 AM. Bring a light insulating layer and shell. No bicycles are allowed on the train or mountain.',
        ],
        links: [
          {
            label: 'Official summit access & return rules',
            href: 'https://www.5schaetze.at/en/schafbergbahn/FAQ-schafbergbahn.html',
          },
        ],
      },
      {
        time: '12:05 PM',
        title: 'Planned Schafbergbahn descent → St. Wolfgang at 12:40 PM',
        type: 'train',
        segmentId: 'schafberg-descent',
        highlight: 'important',
      },
      {
        time: '12:45 PM',
        title: 'Lunch at Café & Restaurant EQ, then change for cycling',
        details: [
          'EQ is at the railway valley station. Tuesday September 8 falls within published restaurant hours 10:30–22:00, kitchen 11:30–20:30. Lunch is not reserved.',
          'Leave summit layers at the hotel; take swimwear, towel, water, sun protection, payment card and a little cash.',
        ],
        links: [
          {
            label: 'EQ opening hours',
            href: 'https://www.5schaetze.at/en/Info_SchafbergBahn_and_WolfgangseeSchifffahrt.html',
          },
        ],
      },
      {
        time: '2:00 PM',
        title: 'Collect two e-trekking bikes — Pro Travel first choice',
        highlight: 'important',
        details: [
          'Pro Travel: Markt-Pilgerstraße 152, St. Wolfgang; +43 6138 2525. The live form quotes €72 for two KTM 500 Wh e-bikes for one day, with locks. Next-day requests must be made by phone, 09:00–18:00; agree 14:00 collection, 17:30 return, correct frame sizes and helmets. No availability confirmed.',
          'See-Biker fallback: Markt 54; +43 660 920 4463. July 2026 price list: e-trekking €39 each for 14:00–18:00, or €49/day. Reservations only from one day; afternoon walk-in stock is not guaranteed.',
          'Schiendorfer in Strobl: Salzburger Straße 37; +43 6137 7245. 2026 e-trekking €34/day, regular trekking €11/half-day; helmets €3/day. Tuesday afternoon 13:00–18:00. Requires relocating the pickup and route to Strobl.',
          'Radhaus: tourism listing quotes St. Gilgen e-trekking €35 (€31.50 with card); Strobl branch is by telephone arrangement. Neither is confirmed for this afternoon. Keep the St. Wolfgang pickup to avoid a ferry or car transfer.',
          'If no local bikes are available, take a lakefront walk and visit the named beach by car; do not treat a rental inquiry as a booking.',
        ],
        links: [
          { label: 'Pro Travel rental & next-day instructions', href: 'https://www.protravel.at/radverleih/' },
          { label: 'Call Pro Travel', href: 'tel:+4361382525' },
          { label: 'See-Biker 2026 prices', href: 'https://www.seebiker.at/verleih/' },
          {
            label: 'Schiendorfer 2026 rental brochure',
            href: 'https://www.schiendorfer.at/_files/ugd/fd1960_be0d2f5f6ede4c87b9bfa252a62be0fa.pdf',
          },
          {
            label: 'Regional rental comparison',
            href: 'https://wolfgangsee.salzkammergut.at/en/informieren/card/wolfgangsee-card-radverleihe.html',
          },
        ],
      },
      {
        time: '2:20 PM',
        title: 'Cycle the signed R2 to Strobl, then Felmayerbad',
        highlight: 'fun',
        details: [
          'Route: St. Wolfgang → signed R2 cycle path → Strobl centre → Seestraße 8, Felmayerbad. Pro Travel publishes 6 km to Strobl on the asphalt R2. The beach access adds distance; allow 40 minutes each way including navigation and stops, not a race pace.',
          'Return on the same route. Do not use the pedestrian Bürglstein boardwalk or the forbidden Falkenstein crossing as cycling shortcuts. Use the beach entrance, not the protected reed beds of Blinklingmoos.',
          'Ride time is an allowance, not a measured GPX duration. The linked operator route continues to St. Gilgen; turn off in Strobl for this shorter swim day.',
        ],
        links: [
          {
            label: 'R2 route description — use St. Wolfgang–Strobl section',
            href: 'https://www.protravel.at/de-radtour-st-gilgen.htm',
          },
          {
            label: 'Felmayerbad entrance map',
            href: 'https://www.google.com/maps/search/?api=1&query=Felmayerbad%20Seestrasse%208%20Strobl',
          },
        ],
      },
      {
        time: '3:00 PM',
        title: 'Swim and relax at Felmayerbad, Strobl',
        highlight: 'fun',
        details: [
          'Exact destination: Liegewiese Felmayer, Seestraße 8, 5350 Strobl. Official listing confirms shade trees, lawn, toilets, showers, changing cabins and food; the buffet publishes 10:00–20:00 on bathing days.',
          'Published adult admission: €6/day, €4.50 after 15:00, or €4 with Wolfgangsee Card. Budget €12 for two so an earlier arrival is covered. September is within the published card season; a specific September 8 gate schedule and water temperature are not published.',
          'Lock bikes before entering; bike-rack availability is not documented. Swim only in the designated area and leave the water if thunder develops. Keep this as a 75-minute swim/rest stop, then allow 15 minutes to dry and change.',
          'Backup beach: Naturstrand Wasswiese, Wassbadstraße 8, Strobl. It publishes the same admission prices, toilets, showers, cabins and a buffet; use it only if confirmed open and shorten the stay to preserve bike return. Municipal information: +43 6137 7256.',
        ],
        links: [
          {
            label: 'Felmayer facilities & admission',
            href: 'https://wolfgangsee.salzkammergut.at/oesterreich-poi/detail/200729/liegewiese-felmayer-mit-beachvolleyballplatz-und-kinderspielplatz.html',
          },
          {
            label: 'May–September beach season',
            href: 'https://wolfgangsee.salzkammergut.at/informieren/wolfgangsee-card/wolfgangseecard-naturstraende-strobl.html',
          },
          {
            label: 'Wasswiese backup beach',
            href: 'https://wolfgangsee.salzkammergut.at/oesterreich-poi/detail/202201/naturstrand-wasswiese.html',
          },
        ],
      },
      {
        time: '4:30 PM',
        title: 'Leave the beach; cycle R2 back to St. Wolfgang',
        details: [
          'Allow 40 minutes back plus a 20-minute return buffer. Skip extra stops if delayed; keep the agreed rental return time.',
        ],
      },
      {
        time: '5:30 PM',
        title: 'Return bikes to the collection shop',
        highlight: 'important',
        details: [
          'Pro Travel return time must be agreed by phone. See-Biker closes at 18:00. Do not assume an unattended after-hours return.',
        ],
      },
      {
        time: '6:30 PM',
        title: 'Dinner in St. Wolfgang and pack for tomorrow',
        details: [
          'Planning budget for two: €122 train + €72 Pro Travel bikes + up to €12 beach = €206 before meals and helmet charges. With See-Biker half-day bikes: €212. No tickets or rentals purchased.',
        ],
      },
    ],
    weather:
      'Forecast checked Sept 7: sunny morning; lake-level afternoon around 30–32°C. Summit morning model around 16–20°C. Late shower/storm timing differs between forecasts.',
    weatherNote:
      'Morning summit, afternoon bike + swim. This live card follows the summit morning only; lake-level heat is higher. Recheck cloud, gusts and thunder before departure. Persistent rain: replace bike/swim with Bad Ischl or a sheltered local afternoon.',
    weatherSource: 'forecast',
    weatherLocation: { name: 'Schafberg summit', coordinates: { lat: 47.776, lng: 13.4335 }, elevationM: 1783 },
    weatherWindow: { label: 'Schafberg morning visit', startHour: 9, endHour: 12 },
    accommodation: 'Hotel Zimmerbräu, St. Wolfgang',
    notes:
      'Planned, not booked. Train times are published daily services, not verified seat inventory. Confirm train seats, two rental bikes with helmets, and beach opening before committing. Hallstatt is an optional separate outing, not part of this day.',
    carryToday: [
      'Light summit layer and shell',
      'Swimwear, towel and dry bag',
      'Water and sunscreen',
      'Helmet and bike lock',
      'Wolfgangsee Card, card and cash',
    ],
  },

  '2026-09-09': {
    isoDate: '2026-09-09',
    date: 'Sept 9',
    dayLabel: 'Day 5 — Wednesday',
    title: 'Fjord Views & Highline 179',
    phaseId: 'tyrol',
    recommendation:
      'Treat this as a scenic transfer with at most one substantial stop. Choose Highline179 only in calm, dry conditions; arrive in Ehrwald with time to recover.',
    alternative:
      'With the September 7 forecast suggesting Wednesday rain/thunder, drive to the hotel with a lunch stop. Plansee is a brief fair-weather detour, not a second required outing.',
    activities: [
      {
        time: '8:00 AM',
        title: 'Check out Zimmerbräu; drive west toward Reutte',
        type: 'drive',
        segmentId: 'lakes-to-lermoos',
        details: [
          'Allow 4–4½ hours including a comfort stop; this is a planning allowance, not a live traffic ETA. The old 10:30 arrival was too optimistic. Check navigation before departure and cross-border permission for any route through Germany.',
          'If traffic pushes Reutte arrival past 13:00, choose Highline179 OR Plansee. Hotel check-in is 15:00–21:30, so there is no need to race for 15:00.',
        ],
      },
      {
        time: '12:30 PM',
        title: 'Lunch and Highline179 / Ehrenberg stop',
        details: [
          'Allow about 90 minutes for parking, access, bridge and lunch; this is a planned window. Published bridge hours are daily 08:00–22:00. Check wind and closure notices before buying.',
          'In persistent rain or strong wind, skip the bridge and continue to Ehrwald.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://www.highline179.tirol/preise',
          },
        ],
      },
      {
        time: '2:00 PM',
        title: 'Optional Plansee shore stop',
        details: [
          'Allow about 30 minutes driving and 45 minutes beside the lake. Choose a short out-and-back near your legal parking place; do not add a full lake walk.',
          'Leave by 15:15. Skip this stop if the road transfer or bridge visit runs late.',
        ],
      },
      {
        time: '3:15 PM',
        title: 'Continue to Ehrwald; settle in at der grüne Baum',
        details: [
          'Allow 60–75 minutes with parking and check-in; arrival around 16:30 is a planning target. Keep the remaining afternoon free for groceries and trail preparation.',
        ],
      },
      {
        time: '6:30 PM',
        title: 'Dinner and tomorrow’s mountain decision',
        details: [
          'Check the Ehrwalder Almbahn, Coburger Hütte and summit-level forecast. If Thursday is unsafe, use the lower-level fallback rather than starting a hike because it is on the calendar.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://www.almbahn.at/de/betriebszeiten/',
          },
        ],
      },
    ],
    weather: 'Tyrol valley weather in September is cool and crisp: roughly 15°C / 59°F highs and 5°C / 41°F lows.',
    weatherNote: 'Road stops are comfortable in layers, but mornings and shaded lake stops feel cold quickly.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Ehrwald', coordinates: { lat: 47.4009, lng: 10.916 } },
    accommodation: 'der grüne Baum Mountain Boutique Hotel',
    carryToday: [
      'Sunglasses',
      'Layer for shaded bridge stops',
      'Toll cash or card backup',
      'Compact towel if you want a Plansee stop',
    ],
  },

  '2026-09-10': {
    isoDate: '2026-09-10',
    date: 'Sept 10',
    dayLabel: 'Day 6 — Thursday',
    title: 'Seebensee & Drachensee — choose the weather window',
    phaseId: 'tyrol',
    recommendation:
      'Coburger Hütte and its two lakes are the alpine priority, but only with safe trails and useful visibility. The September 7 forecast is unsettled; the hiking times below are a fair-weather option, not a commitment.',
    alternative:
      'Wet-day schedule: 09:00 slow breakfast, 10:30 short signed Ehrwald valley walk if dry, 12:30 lunch, afternoon cafés/rest. If Friday improves, move the whole hike to September 11: 08:00 lift, 15:30 descent, collect luggage and drive about 16:30–18:00 to Innsbruck. Drop Zugspitze and the Biberwier walk rather than combining them.',
    activities: [
      {
        time: '7:15 AM',
        title: 'Breakfast and final trail / weather check',
        details: [
          'Take the gondola-start route; do not follow the longer valley-start GPX as the timed route. Avoid Hoher Gang or the Seeben via ferrata as shortcuts.',
          'If thunderstorms, snow/ice or poor visibility threaten, use a short Ehrwald valley walk and café day. If tired but conditions are good, turn around at Seebensee.',
        ],
      },
      {
        time: '8:00 AM',
        title: 'Ehrwalder Almbahn up; start walking around 8:20',
        details: [
          'September published operation is 08:00–17:30. Buy the correct return ticket; the itinerary aims to descend well before the last lift.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://www.almbahn.at/de/betriebszeiten/',
          },
        ],
      },
      {
        time: '8:20 AM',
        title: 'Walk the signed route from Ehrwalder Alm to Seebensee',
        type: 'hike',
        details: [
          'Allow about two hours with photos. Use the forest-road approach and signs for Seebensee; retain time and energy for the steeper hut ascent.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://zugspitzarena.com/en/Mountains-lakes-an-alpine-experience-between-water-and-peaks_tour_232837',
          },
        ],
      },
      {
        time: '10:20 AM',
        title: 'Seebensee break; decide whether to continue to Coburger Hütte',
        type: 'hike',
        details: [
          'Allow 60–75 minutes uphill to the hut if the trail is dry and both travelers feel strong. Turn back from the lake if behind schedule or weather deteriorates.',
        ],
      },
      {
        time: '11:30 AM',
        title: 'Coburger Hütte lunch and Drachensee viewpoint',
        details: [
          'Hut website says open until October 3, 2026. Allow one hour; carry your own food and cash so service or payment availability does not determine the day.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://www.coburgerhuette.at/',
          },
        ],
      },
      {
        time: '12:30 PM',
        title: 'Descend via Seebensee to Ehrwalder Alm',
        type: 'hike',
        details: ['Allow 2½–3 hours with rests. No extra summit or lake circuit.'],
      },
      {
        time: '3:30 PM',
        title: 'Target gondola descent; rest in Ehrwald',
        details: [
          'Aim to reach the upper station by 15:30, two hours before the published last lift. Check the actual final descent time on the day.',
        ],
      },
      {
        time: '6:30 PM',
        title: 'Early dinner and pack for Innsbruck transfer',
      },
    ],
    weather:
      'Coburger Hütte at 1,917 m is typically far colder and windier than Ehrwald, with fast-changing rain and cloud around the lakes.',
    weatherNote:
      'This card follows Coburger Hütte, the high point of the hike. Carry waterproof and insulating layers even if Ehrwald starts warm, and make a morning-of trail and gondola check.',
    weatherSource: 'historical',
    weatherLocation: {
      name: 'Coburger Hütte',
      coordinates: { lat: 47.3617, lng: 10.933 },
      elevationM: 1917,
    },
    weatherWindow: { label: 'Seebensee–Coburger Hütte hike window', startHour: 8, endHour: 15 },
    accommodation: 'der grüne Baum Mountain Boutique Hotel',
    notes:
      'September gondola hours are 8:00 AM–5:30 PM. The published gondola-start route is about 13 km / 580 m gain / 4¾ hrs walking; lunch and photo stops make this a 5½–6 hr outing. The downloadable GPX is a longer valley-start reference, not the timed itinerary route. Carry cash as a payment backup; €50 is a planning allowance, not a quoted meal price.',
    carryToday: [
      'Waterproof shell, packable insulation, hat, and gloves',
      '2 L water capacity per person plus trail food',
      'Blister kit, first aid, space blanket, and headlamp',
      '€50+ hut cash',
      'Correct gondola-start offline route, charged phone, and power bank',
    ],
  },

  '2026-09-11': {
    isoDate: '2026-09-11',
    date: 'Sept 11',
    dayLabel: 'Day 7 — Friday',
    title: 'Best mountain window, then Innsbruck',
    phaseId: 'tyrol',
    recommendation:
      'Use the morning for the experience with the best conditions: the postponed Coburger hike takes priority; otherwise choose Zugspitze only with a clear summit webcam. A short lake walk is optional.',
    alternative:
      'If mountains remain clouded in, leave Ehrwald around 09:30, reach Innsbruck around 11:00 and take lunch before an old-town afternoon. Do not pay for a summit view hidden in cloud. The September 7 model suggested summit temperatures near 0–2°C and substantial cloud, not a guaranteed panorama.',
    activities: [
      {
        time: '7:30 AM',
        title: 'Breakfast, check out and load the car',
        details: [
          'Leave luggage concealed. Choose Zugspitze only if summit visibility and wind justify the ticket; do not precommit based on valley sunshine.',
        ],
      },
      {
        time: '8:40 AM',
        title: 'Tiroler Zugspitzbahn: morning summit visit',
        details: [
          'Published summer operation is 08:40–16:40, every 20 minutes. Start at the Austrian valley station in Ehrwald-Obermoos.',
          'Spend about two hours on the visitor terraces and exhibitions. The exposed summit-cross route is not included in this easy sightseeing visit.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://www.zugspitze.at/de/preise-zeiten/betriebszeiten/',
          },
        ],
      },
      {
        time: '11:00 AM',
        title: 'Descend and have lunch in Ehrwald',
        details: [
          'If the lift is closed or the summit is clouded in, substitute a short valley walk and bring Innsbruck forward.',
        ],
      },
      {
        time: '12:15 PM',
        title: 'Optional Biberwier lake walk',
        details: [
          'Choose one short signed out-and-back with a 13:30 turnaround, rather than the full three-lake hike after yesterday’s long day. Allow time for legal parking.',
          'The full three-lake GPX remains an alternative for a separate half-day, not an extra requirement today.',
        ],
      },
      {
        time: '2:00 PM',
        title: 'Drive to Innsbruck; check in to Urban Inn',
        type: 'drive',
        segmentId: 'ehrwald-to-innsbruck',
        details: ['Allow 75–90 minutes including city traffic and parking. Arrival around 15:30 is a planning target.'],
      },
      {
        time: '4:30 PM',
        title: 'Innsbruck old-town walk',
        details: [
          'Maria-Theresien-Straße → Golden Roof exterior → Inn riverfront → return through the old town. Keep this to 60–90 minutes with café stops.',
        ],
      },
      {
        time: '6:30 PM',
        title: 'Dinner; check Schlegeis road and Olpererhütte conditions',
        details: ['You stay at Urban Inn again tomorrow night. No hotel checkout is needed before Saturday’s hike.'],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://visit.verbund.com/en/schlegeis',
          },
        ],
      },
    ],
    weather: 'The 2,962 m Zugspitze summit can be near or below freezing even while Ehrwald and Innsbruck are warm.',
    weatherNote:
      'This is the summit forecast, not the Ehrwald valley forecast. Take fleece plus packable insulation, shell, warm hat, gloves, and sunglasses; confirm wind, visibility, and cable-car status before going up.',
    weatherSource: 'historical',
    weatherLocation: {
      name: 'Zugspitze summit',
      coordinates: { lat: 47.4211, lng: 10.9854 },
      elevationM: 2962,
    },
    weatherWindow: { label: 'Planned Zugspitze morning visit', startHour: 8, endHour: 11 },
    accommodation: 'Urban Inn - Wilten 24/7, Innsbruck',
    notes:
      "Legs will be tired from Thursday's hike — the lake loop is moderate and the Zugspitze is a cable car, not a climb. Check out early and keep bags in the car.",
    carryToday: [
      'Fleece, packable insulation, and waterproof shell',
      'Warm hat, light gloves, and sunglasses',
      'Small daypack with water and waterproof liner',
      'Charged phone, power bank, and cable-car status check',
    ],
  },

  '2026-09-12': {
    isoDate: '2026-09-12',
    date: 'Sept 12',
    dayLabel: 'Day 8 — Saturday',
    title: 'Easy Achensee day trip and car return',
    phaseId: 'olperer',
    recommendation:
      'One destination: Pertisau on Achensee. Drive over after breakfast, take a short flat lakeside stroll, have lunch and relax by the water. Plan only 20–30 minutes of optional promenade walking, plus getting between the car and café. Leave Pertisau at 14:30 to protect the fixed 17:30 airport car return.',
    alternative:
      'If it is rainy or you are tired, shorten the promenade to a few minutes and spend more time over lunch or coffee. Return early whenever you feel done. If leaving Innsbruck late, shorten the lakeside visit rather than moving the 14:30 return drive later.',
    activities: [
      {
        time: '9:30 AM',
        title: 'Drive from Innsbruck to Pertisau on Achensee',
        type: 'drive',
        segmentId: 'innsbruck-to-pertisau',
        details: [
          'Have breakfast first and leave overnight luggage at Urban Inn; the room is still yours tonight. Allow about 75 minutes including parking, as a planning estimate rather than live traffic.',
          'Follow navigation via the Inntal valley, Wiesing and Maurach to Pertisau. Check the current arrival estimate before leaving and confirm the rental car’s motorway vignette coverage if using the A12.',
        ],
      },
      {
        time: '10:45 AM',
        title: 'Park by the lake and take a short promenade stroll',
        details: [
          'Use the signed paid Uferpromenade parking in Pertisau. Pay the posted tariff and keep the car close to the lake; do not drive into the Karwendel valleys.',
          'Walk along the flat village promenade for 10–15 minutes, then turn back when you feel like it. Benches and lake views are the activity. Stay on the promenade; the Gaisalm route and a full lake circuit are outside today’s plan.',
        ],
        links: [
          {
            label: 'Official Pertisau lakeside parking',
            href: 'https://www.achensee.com/de/map-winter/uferpromenade-pertisau-1-17551943/',
          },
          {
            label: 'Promenade accessibility',
            href: 'https://www.achensee.com/en/map-detail/maurach-pertisau-maurach-121211554/',
          },
        ],
        highlight: 'fun',
      },
      {
        time: '12:00 PM',
        title: 'Lakeside lunch at Café & Restaurant Christina',
        details: [
          'Café & Restaurant Christina, Seepromenade 27: the tourism listing gives Saturday 10:00–22:00 and hot food 11:00–21:00. Allow an hour for lunch, indoors if breezy or rainy. No table is reserved; use a nearby café if full.',
        ],
        links: [
          {
            label: 'Christina hours and location',
            href: 'https://www.achensee.com/de/map-detail/cafe-restaurant-christina-118124727/',
          },
        ],
      },
      {
        time: '1:00 PM',
        title: 'Coffee, lake views and time to sit',
        details: [
          'Keep the afternoon deliberately empty: read, take photos from the promenade or have another coffee. No boat timetable, cable car or additional stop to fit in.',
        ],
      },
      {
        time: '2:30 PM',
        title: 'Leave Pertisau and drive back toward Innsbruck Airport',
        type: 'drive',
        segmentId: 'pertisau-to-innsbruck-airport',
        details: [
          'Allow up to 90 minutes for the return drive as a planning buffer, then fuel and handover time. Check live navigation before lunch and leave earlier if delays are building.',
          'Aim to be back in the Innsbruck area around 16:00 and at the rental return area by 17:00. If ahead of schedule, take a nearby break or return the car earlier under the rental terms; do not add another excursion.',
        ],
      },
      {
        time: '4:30 PM',
        title: 'Refuel as required and prepare rental handover',
        details: [
          'Photograph the car condition and fuel level; keep the return receipt. Follow airport signs and your rental provider’s instructions.',
        ],
      },
      {
        time: '5:30 PM',
        title: 'Confirmed car return at Innsbruck Airport',
        links: [
          {
            label: 'SIXT airport return directions',
            href: 'https://www.sixt.com/car-rental/austria/innsbruck/innsbruck-airport/',
          },
        ],
        details: [
          'Follow blue Car rental return signs into the garage, take the barrier chip and use a marked SIXT space in area A on the ground floor. Leave the chip in the vehicle or hand it over with the key. Published Saturday counter hours are 08:00–19:00; the rental deadline remains 17:30.',
        ],
      },
      {
        time: '6:00 PM',
        title: 'Take the next F bus toward Innsbruck Hbf, then freshen up at Urban Inn',
        details: [
          'Airport information describes about 20 minutes to the city / main station. This is a target departure, not a verified bus timetable; use the next posted F service.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://www.innsbruck-airport.com/unternehmen/aktuelles-fakten/news-presse/detail/zusaetzliche-frequenz-auf-der-linie-f/',
          },
        ],
      },
      {
        time: '7:15 PM',
        title: 'Dinner at Die Wilderin, with Stiftskeller as backup',
        details: [
          'Die Wilderin on Seilergasse serves seasonal regional food; the tourism listing gives Saturday opening from 17:00. Check for a table before walking over. Dinner is a suggestion, not a reservation.',
          'If it is full or you want something simpler, Stiftskeller serves food until 22:00. Keep dinner relaxed and leave energy for packing; there is no need for another sightseeing stop.',
        ],
        links: [
          { label: 'Die Wilderin', href: 'https://www.diewilderin.at/' },
          { label: 'Published Wilderin hours', href: 'https://www.tyrol.com/activities/food/restaurants/die-wilderin' },
          { label: 'Stiftskeller kitchen hours', href: 'https://www.stiftskeller.eu/en/opening-hours' },
        ],
        highlight: 'fun',
      },
      {
        time: '8:30 PM',
        title: 'Pack for checkout and check the return flights',
        details: [
          'Dry hiking layers and separate tomorrow’s train food, passports, medication and chargers. Check the room, car-return receipt and Sunday train details before winding down.',
          'Austrian check-in normally opens today at 09:00 CEST. USA itinerary boarding passes are withheld until Sunday 08:00 CEST; try again then if passes are unavailable tonight.',
        ],
        links: [{ label: 'Austrian online check-in', href: 'https://www.austrian.com/at/en/online-check-in' }],
      },
    ],
    weather: 'Check the lakeside forecast for Pertisau; a breeze by the water can feel cool even in mild weather.',
    weatherNote:
      'This forecast is for the lakeside day at Pertisau. Use a light warm layer and rain jacket; shorten the stroll if the weather is unpleasant.',
    weatherSource: 'historical',
    weatherLocation: {
      name: 'Pertisau · Achensee lakeside',
      coordinates: { lat: 47.4407, lng: 11.7025 },
      elevationM: 930,
    },
    weatherWindow: { label: 'Pertisau lakeside visit', startHour: 10, endHour: 14 },
    accommodation: 'Urban Inn - Wilten 24/7, Innsbruck',
    notes:
      'A relaxed day trip with a short optional flat stroll, lunch and lake views. Driving times are planning allowances, not live traffic. Leave Pertisau at 14:30, refuel around 16:30 and aim for the airport return area at 17:00. The confirmed car return remains 17:30.',
    carryToday: [
      'Comfortable everyday shoes',
      'Light warm layer and rain jacket',
      'Water, sunglasses and a small snack',
      'Phone, charger and offline navigation',
      'Payment card, a little cash, car keys and rental details',
    ],
  },

  '2026-09-13': {
    isoDate: '2026-09-13',
    date: 'Sept 13',
    dayLabel: 'Day 9 — Sunday',
    title: 'An easy Innsbruck morning, then the airport train',
    phaseId: 'olperer',
    recommendation:
      'Keep the final Innsbruck morning walkable and close to the station. Early lunch plus a short Hofkirche visit is a better fit than adding another mountain excursion.',
    alternative:
      'Skip Hofkirche if luggage handling or lunch runs late. Use the spare time at the station; the airport train is the travel priority.',
    activities: [
      {
        time: '8:00 AM',
        title: 'Breakfast and save Monday’s boarding passes',
        details: [
          'Allow a relaxed breakfast before checkout. Bäckerei Ruetz at Innsbruck Hbf is a practical fallback; ÖBB lists it open daily 05:00–20:00.',
          'Check Austrian for both travelers and both flight legs now that the USA boarding-pass window has opened. Save passes offline and check whether a staffed document check is still required.',
        ],
        links: [
          { label: 'Station food and services', href: 'https://bahnhof.oebb.at/en/tirol/innsbruck-hauptbahnhof' },
          { label: 'Austrian online check-in', href: 'https://www.austrian.com/at/en/online-check-in' },
        ],
      },
      {
        time: '9:00 AM',
        title: 'Check out Urban Inn and store luggage',
        details: [
          'Check out by 09:00 as planned; the saved property deadline is 11:00. Allow 20–25 minutes to reach Innsbruck Hbf with bags and another 15 minutes for storage.',
          'ÖBB lists lockers downstairs near the garage, north underpass and WC area. Follow current signs and the posted payment instructions; size, price and availability are checked at booking. Do not assume Urban Inn has a staffed luggage desk.',
          'If you cannot store both bags by 09:45, simplify to breakfast near Hbf and a short walk with bags. Skip the church and long loop rather than spending the morning searching for storage.',
          'Keep passports, rail tickets, medication and valuables in the day bag.',
        ],
        links: [
          {
            label: 'Innsbruck Hbf luggage storage',
            href: 'https://bahnhofcityinnsbruck.oebb.at/de/services/schliessfaecher',
          },
        ],
      },
      {
        time: '10:00 AM',
        title: 'Old town and Inn riverfront stroll',
        details: [
          'From Hbf: Maria-Theresien-Straße → Golden Roof exterior → Inn bridge views → Hofgarten → lunch in the old town. Allow 75–90 minutes at strolling pace, with café and photo stops; this is a planning allowance.',
          'Keep the morning local. In rain, shorten the river walk and spend longer over coffee; Hofkirche remains the optional indoor stop after lunch. Nordkette and Swarovski do not fit this departure morning.',
        ],
      },
      {
        time: '11:30 AM',
        title: 'Early Tyrolean lunch at Stiftskeller',
        details: [
          'Stiftskeller’s kitchen opens at 11:00 daily, including Sunday. Allow 45–50 minutes and keep lunch to one course if visiting Hofkirche next. No table has been reserved.',
          'If there is a queue or lunch runs late, skip Hofkirche. Die Wilderin opens at 17:00 on Sundays, after your train, so it is a Saturday dinner choice.',
        ],
        links: [
          { label: 'Stiftskeller opening and kitchen hours', href: 'https://www.stiftskeller.eu/en/opening-hours' },
        ],
        highlight: 'fun',
      },
      {
        time: '12:30 PM',
        title: 'Optional Hofkirche visit',
        details: [
          'Sunday opening is 12:30–17:00; enter through the Tiroler Volkskunstmuseum. Allow 30–40 minutes with a firm 13:10 departure for Hbf. Skip the visit if lunch runs late.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://www.tiroler-landesmuseen.at/haeuser/hofkirche/besucherinfo-hofkirche/',
          },
        ],
      },
      {
        time: '1:30 PM',
        title: 'Collect bags at Innsbruck Hbf and buy train food',
        details: [
          'Allow 20 minutes back from Hofkirche plus time to collect bags. MPREIS in Hbf is listed open daily 06:00–21:00; buy sandwiches, water and a shelf-stable dinner backup for the five-hour ride. Do not depend on the onboard bistro.',
          'Finish storage and shopping by 14:00. Check the actual train, destination, platform and coach position; be ready to board around 14:30. Departure is recorded as 14:56, subject to the ticket and live ÖBB information.',
        ],
        links: [
          { label: 'ÖBB station shops and services', href: 'https://bahnhof.oebb.at/en/tirol/innsbruck-hauptbahnhof' },
        ],
      },
      {
        time: '2:56 PM',
        title: 'Booked RJX 13479 to Vienna Airport',
        type: 'train',
        segmentId: 'innsbruck-vienna-airport-rail',
        details: [
          'Direct service and first-class seats are recorded as booked. Match the coach and seats to your private ticket. Stay aboard to Flughafen Wien if the live destination confirms the direct service; do not get off at Wien Hbf out of habit.',
          'If cancelled or rerouted, ask ÖBB staff for a replacement connection all the way to Flughafen Wien and check ticket validity before buying anything. If arrival slips substantially, update the hotel using your private booking contact.',
        ],
        links: [
          {
            label: 'Official visitor information',
            href: 'https://fahrplan.oebb.at/',
          },
        ],
      },
      {
        time: '7:55 PM',
        title: 'Planned arrival at Wien Flughafen; walk to NH Vienna Airport',
        details: [
          'Arrival is approximate in the existing booking record. Allow 20 minutes from platform to hotel and keep tomorrow’s airport essentials accessible.',
        ],
        links: [
          {
            label: 'NH airport hotel directions',
            href: 'https://www.nh-hotels.com/en/hotel/nh-vienna-airport-conference-center/map',
          },
        ],
      },
      {
        time: '8:15 PM',
        title: 'Check in and have a light dinner at NH',
        details: [
          'Mundo at the hotel publishes an à la carte menu until 22:00. Aim to eat by 20:30; availability is not reserved. If the train is late, use the food bought at Hbf and ask reception what is still serving.',
          'Ask about early-bird breakfast availability and cost, agree early checkout, and keep the morning bag separate. A hotel breakfast is not recorded as included.',
        ],
        links: [
          {
            label: 'NH dining and early-bird breakfast',
            href: 'https://www.nh-hotels.com/en/hotel/nh-vienna-airport-conference-center/restaurants',
          },
        ],
      },
      {
        time: '9:15 PM',
        title: 'Final flight check, two alarms and lights out',
        details: [
          'Check both flights and boarding deadlines, charge devices and put passports with the boarding passes. Default wake-up is 05:00 for hand luggage only; use 04:30 if checking a bag or the airline requests an earlier arrival.',
          'Keep a small breakfast and water ready. Finish packing tonight so Monday starts with a short walk to the terminal.',
        ],
      },
    ],
    weather: 'Innsbruck typically runs cooler than Vienna in September: about 14°C / 58°F high and 4°C / 39°F low.',
    weatherNote: 'The morning can be cold enough for a fleece before the long train ride east.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Innsbruck', coordinates: { lat: 47.2692, lng: 11.4041 } },
    accommodation: 'NH Vienna Airport',
    notes: 'Seat reservation is recorded as booked for RJX 13479 (14:56). Keep the confirmation handy.',
    carryToday: [
      'Small old-town day bag',
      'Railjet seat reservation',
      'Hotel essentials kept accessible',
      'Warm layer for the platform',
      'Both flight boarding passes saved offline',
      'Train food, water and a dinner backup',
      'Payment card and phone for luggage storage',
    ],
  },

  '2026-09-14': {
    isoDate: '2026-09-14',
    date: 'Sept 14',
    dayLabel: 'Day 10 — Monday',
    title: 'Fly home via Frankfurt',
    phaseId: 'olperer',
    recommendation:
      'For the recorded hand-luggage plan, wake at 05:00, leave NH at 05:15 and aim to be inside the terminal at 05:30 for the 08:00 flight. Keep the Frankfurt transfer direct: the 75-minute gap includes walking, passport control and boarding.',
    alternative:
      'If checking a bag, wake at 04:30, check out at 04:45 and reach the terminal by 05:00. Vienna Airport recommends three hours with checked luggage and two hours with hand luggage. The airline’s current instructions and boarding deadlines take precedence; all flight times here are saved itinerary records.',
    alternativeLinks: [
      {
        label: 'Vienna Airport arrival-time guidance',
        href: 'https://viennaairport.com/en/passengers/arrival__departure/tips_for_departure',
      },
    ],
    activities: [
      {
        time: '5:00 AM',
        title: 'Wake, quick breakfast and final room check',
        details: [
          'Use the early breakfast arranged with reception or your own food. Check the safe, sockets and bathroom; keep passports, medication and devices in the day bag.',
        ],
      },
      {
        time: '5:15 AM',
        title: 'Check out NH and walk to the terminal',
        details: [
          'NH publishes a six-minute airport walk; allow 15 minutes with bags and wayfinding. Use the earlier 04:45 departure if checking luggage.',
        ],
        links: [
          {
            label: 'Hotel-to-airport directions',
            href: 'https://www.nh-hotels.com/en/hotel/nh-vienna-airport-conference-center/map',
          },
        ],
        highlight: 'important',
      },
      {
        time: '5:30 AM',
        title: 'Airline document check if needed, then security at VIE',
        details: [
          'Verify the operating airline, desk and boarding deadline in the app. Use a staffed desk if document checks are required. If checking a bag, arrive at 05:00 instead and confirm the bag tag says SEA.',
          'Save both boarding passes and confirm the short Frankfurt connection. Do not assume first-class rail tickets provide any airport fast-track or lounge access.',
        ],
        links: [
          {
            label: 'Vienna Airport departure information',
            href: 'https://www.viennaairport.com/en/passengers/arrival__departure/departures',
          },
        ],
        highlight: 'important',
      },
      {
        time: '6:45 AM',
        title: 'Be near the assigned OS203 gate',
        details: [
          'This is a planning target, not the airline’s boarding time. Follow the boarding pass and screens, refill water after security and finish any food before boarding begins.',
        ],
      },
      {
        time: '8:00 AM',
        title: 'VIE → FRA (OS203, 1h30m; arrive 9:30 AM)',
        highlight: 'important',
        type: 'flight',
        segmentId: 'vie-fra',
      },
      {
        time: '9:30 AM',
        title: 'At Frankfurt, go directly to the current LH490 gate',
        details: [
          'Scheduled arrival is 09:30 CEST. Follow transfer signs and the airport’s displayed walking time to the actual Seattle gate; Schengen exit passport control and possible extra security reduce the 75-minute gap.',
          'Use the airline transfer desk or airport service staff if delayed or missing a boarding pass. Fast lanes are conditional on the flight being displayed at the checkpoint. Through-checked bags normally transfer automatically; confirm at VIE.',
        ],
        links: [
          {
            label: 'Frankfurt transfer instructions',
            href: 'https://www.frankfurt-airport.com/en/flights-and-transfer/transferring-at-fra.html',
          },
        ],
        highlight: 'important',
      },
      {
        time: '10:45 AM',
        title: 'FRA → SEA (LH490, ~10h10m; arrival in Seattle local time)',
        highlight: 'important',
        type: 'flight',
        segmentId: 'fra-sea',
      },
      {
        time: '11:55 AM PDT',
        title: 'Arrive Seattle; clear entry formalities and head home',
        details: [
          '11:55 is Seattle local time, nine hours behind Vienna on this date. Allow for entry formalities and any baggage collection before arranging the ride home; do not promise a pickup at landing time.',
        ],
        highlight: 'important',
        type: 'flight',
      },
    ],
    weather:
      'Vienna Airport mornings are usually cool, around the low-to-mid teens °C, before warming later in the day.',
    weatherNote: 'You only need airport-comfort layers here, but keep the shell accessible in your personal item.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Vienna Airport', coordinates: { lat: 48.1103, lng: 16.5697 } },
    carryToday: [
      'Passport and both boarding passes',
      'Medication and valuables',
      'Liquids bag',
      'Chargers and power bank',
      'Small breakfast',
      'Shell in personal item',
    ],
    notes:
      'All times are CEST until the explicitly labeled Seattle arrival in PDT. Boarding deadlines, desks and gates come from the airline on the day. The saved 75-minute FRA connection is not a guarantee against delay.',
  },
}
