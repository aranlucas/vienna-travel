import type { Coordinates } from './trip'

export type ActivityType = 'activity' | 'hike' | 'drive' | 'flight'

export interface DayActivity {
  /** Structured time, e.g. '8:30 AM'. Undefined for untimed/evening activities. */
  time?: string
  /** Activity description without any time prefix. */
  title: string
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
  '2037-09-05': {
    isoDate: '2037-09-05',
    date: 'Sept 5',
    dayLabel: 'Day 1 — Saturday',
    title: 'Arrival & Easy Evening',
    phaseId: 'vienna',
    activities: [
      { time: '4:35 PM', title: 'Land at VIE (EX 101 via MUC); customs and baggage ~30 min', highlight: 'important' },
      {
        time: '5:15 PM',
        title: 'Buy hiking snacks at an open VIE or Wien Mitte supermarket; do not depend on Naschmarkt stalls',
        highlight: 'important',
      },
      { time: '5:45 PM', title: 'CAT or S7 train to city center (~16–25 min)', highlight: 'important' },
      { time: '6:15 PM', title: 'Check in at Vienna City Hotel in the city centre', highlight: 'important' },
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
    accommodation: 'Vienna City Hotel',
    notes:
      'Naschmarkt market stalls close by 6:00 PM Saturday and are not a reliable arrival-day supply stop. Restaurants may operate later and some open Sunday.',
    carryToday: ['Passport and arrival docs', 'Light city layer', 'Reusable tote for market snacks', 'Phone charger'],
  },

  '2037-09-06': {
    isoDate: '2037-09-06',
    date: 'Sept 6',
    dayLabel: 'Day 2 — Sunday',
    title: 'Palaces & Wine',
    phaseId: 'vienna',
    activities: [
      { time: '9:00 AM', title: 'Breakfast at the hotel (daily breakfast included)', highlight: 'fun' },
      {
        time: '10:00 AM',
        title:
          'Choose one museum: KHM for the imperial art collection (paid; buy online), or Wien Museum Karlsplatz for its free permanent collection and first-Sunday special-exhibition access. Albertina and Belvedere are paid alternatives.',
        highlight: 'fun',
      },
      { time: '1:00 PM', title: 'Lunch near the palace, then head back to the center', highlight: 'important' },
      {
        time: '2:30 PM',
        title: 'Ringstraße core walk: Opera → Albertina exterior → Burggarten → Hofburg (~2 hrs, easy stroll)',
        highlight: 'fun',
      },
      { time: '5:00 PM', title: 'Café Central for Melange and Apfelstrudel', highlight: 'fun' },
      { time: '6:30 PM', title: 'Tram/taxi to Grinzing; early dinner at a Heuriger wine tavern', highlight: 'fun' },
      { time: '9:00 PM', title: "Return to Vienna Hotel; pack for tomorrow's checkout", highlight: 'important' },
    ],
    weather: 'Vienna again: typically about 21°C / 70°F high and 14°C / 57°F low.',
    weatherNote:
      'Comfortable walking weather, but carry a light layer for the evening and any windy tram or wine-hill stop.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Vienna', coordinates: { lat: 48.2082, lng: 16.3738 } },
    accommodation: 'Vienna City Hotel',
    notes:
      'Important correction: Vienna does not have a blanket first-Sunday-free rule for federal museums. The first-Sunday offer applies to the Wien Museum network; KHM, Albertina, Belvedere, NHM, MAK, and Weltmuseum use their normal admission rules. Checkout Monday Sept 7 at noon.',
    carryToday: ['Water bottle', 'Church-ready light layer', 'Museum tickets or booking emails', 'Compact umbrella'],
  },

  '2037-09-07': {
    isoDate: '2037-09-07',
    date: 'Sept 7',
    dayLabel: 'Day 3 — Monday',
    title: 'Transit to the Turquoise Lakes',
    phaseId: 'salzkammergut',
    activities: [
      {
        time: '7:00 AM',
        title: 'Breakfast at the hotel, check out, and confirm the Railjet platform in the ÖBB app',
        highlight: 'important',
      },
      {
        time: '7:45 AM',
        title: 'Taxi or walk to Wien Hbf (~15 min); take a Railjet scheduled to reach Salzburg by 11:00 AM',
        highlight: 'important',
      },
      { time: '12:00 PM', title: 'Pick up the sample rental car near Salzburg Hbf', highlight: 'important' },
      {
        time: '12:30 PM',
        title: 'Drive to Mondsee (~25 min) — visit the Sound of Music church',
        highlight: 'fun',
        type: 'drive',
        segmentId: 'salzburg-to-lakes',
      },
      { time: '1:30 PM', title: 'Continue to Attersee (~30 min) — lunch by the lake', highlight: 'fun' },
      {
        time: '3:00 PM',
        title: 'Drive to St. Wolfgang (~30 min); check in at Lakeside Guesthouse',
        highlight: 'important',
      },
      { title: 'Evening — Stroll the St. Wolfgang lakefront', highlight: 'fun' },
    ],
    weather:
      'St. Wolfgang / lake district typical September weather: around 20°C / 68°F by day and 10°C / 50°F at night.',
    weatherNote:
      'This card follows the lake destination rather than Salzburg. Keep a shell accessible during the drive and a light layer ready for the lakefront evening.',
    weatherSource: 'historical',
    weatherLocation: { name: 'St. Wolfgang', coordinates: { lat: 47.7377, lng: 13.4437 } },
    accommodation: 'Lakeside Guesthouse, St. Wolfgang',
    notes:
      'The sample rental pickup is set for noon near Salzburg Hbf. Preserve at least 45 minutes between the scheduled train arrival and pickup, and confirm the Austrian vignette is active before leaving.',
    carryToday: [
      'Train tickets and ID',
      'Rental car pickup documents',
      'Light fleece for lake evening',
      'Snacks for the transfer day',
    ],
  },

  '2037-09-08': {
    isoDate: '2037-09-08',
    date: 'Sept 8',
    dayLabel: 'Day 4 — Tuesday',
    title: 'Hallstatt & Schafberg Summit',
    phaseId: 'salzkammergut',
    activities: [
      {
        time: '6:45 AM',
        title: 'Depart St. Wolfgang; drive 45 min to Hallstatt',
        highlight: 'important',
        type: 'drive',
        segmentId: 'base-to-hallstatt',
      },
      {
        time: '7:30 AM',
        title: 'Arrive Hallstatt before tour buses; walk the old town and lakeside promenade',
        highlight: 'fun',
      },
      {
        time: '8:45 AM',
        title: 'Be at the rebuilt Salzbergbahn valley station with a first-ascent ticket ready',
        highlight: 'important',
      },
      {
        time: '9:00 AM',
        title:
          'Ride up for the Skywalk "World Heritage View" only; the salt-mine tour does not fit the 10:15 AM departure',
        highlight: 'fun',
      },
      {
        time: '10:15 AM',
        title: 'Leave Hallstatt; drive 45 min back to St. Wolfgang',
        highlight: 'important',
        type: 'drive',
        segmentId: 'hallstatt-to-st-wolfgang',
      },
      { time: '11:15 AM', title: 'Break at the hotel or grab an early lunch in St. Wolfgang', highlight: 'fun' },
      { title: 'Use the time on a real Schafbergbahn ticket; sit on the right for lake views', highlight: 'fun' },
      { title: 'Summit time — panoramic views of 7 lakes; follow the booked return slot', highlight: 'fun' },
      { title: 'Evening — Dinner at Lakeside Guesthouse; pack for the Ehrwald drive tomorrow', highlight: 'important' },
    ],
    weather:
      'Schafberg summit is much colder and windier than Hallstatt or St. Wolfgang, even when the lakes are mild.',
    weatherNote:
      "This is the Schafberg summit forecast, the day's most exposed stop. Bring a waterproof shell, insulating layer, warm hat, and light gloves; recheck railway operation if rain or gusts rise.",
    weatherSource: 'historical',
    weatherLocation: {
      name: 'Schafberg summit',
      coordinates: { lat: 47.776, lng: 13.4335 },
      elevationM: 1783,
    },
    weatherWindow: { label: 'Booked Schafbergbahn summit window', startHour: 12, endHour: 17 },
    accommodation: 'Lakeside Guesthouse, St. Wolfgang',
    notes:
      'This sample plan assumes a reserved Schafbergbahn time slot. Verify current funicular hours, operations, parking, and ticket conditions before using the itinerary.',
    carryToday: [
      'Waterproof shell and packable insulation',
      'Warm hat and light gloves',
      'Water, snack, and waterproof pack liner',
      'Grippy water-resistant footwear',
      'Any real attraction tickets, stored outside the repository',
    ],
  },

  '2037-09-09': {
    isoDate: '2037-09-09',
    date: 'Sept 9',
    dayLabel: 'Day 5 — Wednesday',
    title: 'Fjord Views & Highline 179',
    phaseId: 'tyrol',
    activities: [
      {
        time: '8:00 AM',
        title: 'Check out Lakeside Guesthouse; drive west toward Ehrwald (~3 hrs total with stops)',
        highlight: 'important',
        type: 'drive',
        segmentId: 'lakes-to-lermoos',
      },
      { time: '10:30 AM', title: 'Stop at Highline 179 suspension bridge near Reutte (~1 hr visit)', highlight: 'fun' },
      { time: '12:00 PM', title: 'Continue to Plansee (the "Austrian fjord"); lunch by the lake', highlight: 'fun' },
      {
        time: '2:30 PM',
        title: 'Leave Plansee; shorten the stop if the western drive is running late',
        highlight: 'important',
      },
      { time: '3:00 PM', title: 'Arrive in Ehrwald and check in at Tyrol Mountain Hotel', highlight: 'important' },
      { title: "Afternoon — Rest and prep gear for tomorrow's big hike", highlight: 'important' },
    ],
    weather: 'Tyrol valley weather in September is cool and crisp: roughly 15°C / 59°F highs and 5°C / 41°F lows.',
    weatherNote: 'Road stops are comfortable in layers, but mornings and shaded lake stops feel cold quickly.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Ehrwald', coordinates: { lat: 47.4009, lng: 10.916 } },
    accommodation: 'Tyrol Mountain Hotel',
    carryToday: [
      'Sunglasses',
      'Layer for shaded bridge stops',
      'Toll cash or card backup',
      'Compact towel if you want a Plansee stop',
    ],
  },

  '2037-09-10': {
    isoDate: '2037-09-10',
    date: 'Sept 10',
    dayLabel: 'Day 6 — Thursday',
    title: 'King of Hikes: Seebensee & Drachensee',
    phaseId: 'tyrol',
    activities: [
      {
        time: '8:00 AM',
        title: 'Take the first Ehrwalder Almbahn gondola up to Ehrwalder Alm (1,502 m)',
        highlight: 'important',
      },
      {
        time: '8:30 AM',
        title: 'Hike the signed gondola-start route from Ehrwalder Alm to Seebensee (~1.5 hrs)',
        highlight: 'fun',
        type: 'hike',
      },
      {
        time: '10:30 AM',
        title: 'Continue uphill to Coburger Hütte at 1,920 m (~1 hr, steeper trail with emerald Drachensee views)',
        highlight: 'fun',
        type: 'hike',
      },
      {
        time: '11:30 AM',
        title: 'Lunch at Coburger Hütte — order the Kaiserschmarrn (best in the region!)',
        highlight: 'fun',
      },
      {
        time: '1:00 PM',
        title: 'Descend back via Seebensee to Ehrwalder Alm (~1.5 hrs)',
        highlight: 'important',
        type: 'hike',
      },
      {
        time: '2:30 PM',
        title: 'Gondola back down to Ehrwald; free afternoon to explore town or rest',
        highlight: 'important',
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
    accommodation: 'Tyrol Mountain Hotel',
    notes:
      'September gondola hours are 8:00 AM–5:30 PM. The published gondola-start route is about 13 km / 580 m gain / 4¾ hrs walking; lunch and photo stops make this a 5½–6 hr outing. The downloadable GPX is a longer valley-start reference, not the timed itinerary route. Bring €50+ cash — the hut is card-unreliable.',
    carryToday: [
      'Waterproof shell, packable insulation, hat, and gloves',
      '2 L water capacity per person plus trail food',
      'Blister kit, first aid, space blanket, and headlamp',
      '€50+ hut cash',
      'Correct gondola-start offline route, charged phone, and power bank',
    ],
  },

  '2037-09-11': {
    isoDate: '2037-09-11',
    date: 'Sept 11',
    dayLabel: 'Day 7 — Friday',
    title: 'Biberwier Loop & Zugspitze Summit',
    phaseId: 'tyrol',
    activities: [
      { time: '7:30 AM', title: 'Check out Tyrol Mountain Hotel; load car', highlight: 'important' },
      {
        time: '8:00 AM',
        title: 'Drive 10 min to Biberwier; start the 3-Lake Loop (Blindsee "ghost trees," Mittersee, Weißensee)',
        highlight: 'fun',
        type: 'hike',
      },
      { time: '11:00 AM', title: 'Finish the loop (~3 hrs, moderate); drive back to Ehrwald', highlight: 'important' },
      {
        time: '12:00 PM',
        title: 'Take the Tiroler Zugspitzbahn cable car to the 9,718 ft summit (~10 min ride)',
        highlight: 'fun',
      },
      {
        time: '12:30 PM',
        title: 'Explore the summit platform and walk across the Austrian–German border!',
        highlight: 'fun',
      },
      { time: '2:00 PM', title: 'Cable car back down to Ehrwald', highlight: 'important' },
      {
        time: '2:30 PM',
        title: 'Drive 30 min to Innsbruck; check in to Innsbruck Apartment',
        highlight: 'important',
        type: 'drive',
        segmentId: 'ehrwald-to-innsbruck',
      },
      { title: 'Evening — Explore Innsbruck Old Town, dinner in the city', highlight: 'fun' },
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
    weatherWindow: { label: 'Planned Zugspitze summit visit', startHour: 12, endHour: 14 },
    accommodation: 'Innsbruck City Apartment, Innsbruck',
    notes:
      "Legs will be tired from Thursday's hike — the lake loop is moderate and the Zugspitze is a cable car, not a climb. Check out early and keep bags in the car.",
    carryToday: [
      'Fleece, packable insulation, and waterproof shell',
      'Warm hat, light gloves, and sunglasses',
      'Small daypack with water and waterproof liner',
      'Charged phone, power bank, and cable-car status check',
    ],
  },

  '2037-09-12': {
    isoDate: '2037-09-12',
    date: 'Sept 12',
    dayLabel: 'Day 8 — Saturday',
    title: 'Zillertal Crossing & Olpererhütte',
    phaseId: 'olperer',
    activities: [
      {
        time: '7:00 AM',
        title: 'Check out; drive 1.5 hrs to Schlegeis Reservoir when the alpine road opens',
        highlight: 'important',
        type: 'drive',
        segmentId: 'innsbruck-to-schlegeis',
      },
      { time: '8:30 AM', title: 'Arrive, park, and prepare hiking gear', highlight: 'important' },
      { time: '9:00 AM', title: 'Hike Trail 502 to Olpererhütte (1.5–2 hours up)', highlight: 'fun', type: 'hike' },
      { time: '11:00 AM', title: 'Lunch/photo stop at Olpererhütte suspension bridge viewpoint', highlight: 'fun' },
      {
        time: '11:45 AM',
        title: 'Descend Trail 502 back to Schlegeis parking (about 1.5 hours)',
        highlight: 'important',
        type: 'hike',
      },
      { time: '1:30 PM', title: 'Boot change, water refill, and a full road-delay buffer', highlight: 'important' },
      {
        time: '2:30 PM',
        title: 'Leave Schlegeis no later than this; drive toward Innsbruck Airport',
        highlight: 'important',
        type: 'drive',
        segmentId: 'schlegeis-to-innsbruck',
      },
      {
        time: '4:30 PM',
        title: 'Reach the airport area; refuel if required by the rental agreement',
        highlight: 'important',
      },
      {
        time: '5:30 PM',
        title: 'Return rental at Innsbruck Airport parking area A; follow blue “Car rental return” signs',
        highlight: 'important',
      },
      { time: '6:00 PM', title: 'Take bus F back toward Innsbruck Hbf / city center', highlight: 'important' },
      { title: 'Evening: Dinner in Innsbruck — last night in Tyrol', highlight: 'fun' },
    ],
    weather: 'Olpererhütte at 2,389 m is far colder and more exposed than Innsbruck or the Zillertal valley.',
    weatherNote:
      'This is the Olpererhütte forecast at the hike high point. Waterproof layers, insulation, hat, gloves, grippy footwear, and a morning-of trail and road check are non-negotiable.',
    weatherSource: 'historical',
    weatherLocation: {
      name: 'Olpererhütte',
      coordinates: { lat: 47.0421, lng: 11.688 },
      elevationM: 2389,
    },
    weatherWindow: { label: 'Trail 502 and hut window', startHour: 8, endHour: 14 },
    accommodation: 'Innsbruck City Apartment, Innsbruck',
    notes:
      'Road hours, tolls, parking, and traffic control can change; verify them before travel. The sample 2:30 PM departure cutoff protects the fictional 5:30 PM airport return.',
    carryToday: [
      'Waterproof shell and rain pants plus packable insulation',
      'Warm hat, light gloves, and grippy water-resistant footwear',
      '2 L water capacity per person plus trail food',
      'First aid, space blanket, headlamp, and waterproof pack liner',
      '€100+ hut cash',
      'Offline map, charged phone, and power bank',
    ],
  },

  '2037-09-13': {
    isoDate: '2037-09-13',
    date: 'Sept 13',
    dayLabel: 'Day 9 — Sunday',
    title: 'Innsbruck & The Long Rail Home',
    phaseId: 'olperer',
    activities: [
      {
        time: '9:00 AM',
        title: 'Check out Innsbruck Apartment; store bags at Hbf lockers or front desk',
        highlight: 'important',
      },
      {
        time: '9:30 AM',
        title: 'Stroll Innsbruck Old Town: Golden Roof (Goldenes Dachl), Hofburg, Maria-Theresien-Straße',
        highlight: 'fun',
      },
      { time: '12:00 PM', title: 'Lunch in the Old Town', highlight: 'fun' },
      { time: '2:00 PM', title: 'Head to Innsbruck Hbf; collect bags', highlight: 'important' },
      {
        time: '2:56 PM',
        title: 'Board the sample direct Railjet to Vienna Airport (arrive around 7:55 PM)',
        highlight: 'important',
      },
      { time: '7:55 PM', title: 'Arrive Wien Flughafen station (inside terminal building)', highlight: 'important' },
      { time: '8:15 PM', title: 'Check in at Vienna Airport Hotel (steps from the station)', highlight: 'important' },
    ],
    weather: 'Innsbruck typically runs cooler than Vienna in September: about 14°C / 58°F high and 4°C / 39°F low.',
    weatherNote: 'The morning can be cold enough for a fleece before the long train ride east.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Innsbruck', coordinates: { lat: 47.2692, lng: 11.4041 } },
    accommodation: 'Vienna Airport Hotel',
    notes:
      'This fictional itinerary marks the sample direct train as reserved. Verify the real timetable, platform, and reservation requirements before travel.',
    carryToday: [
      'Small old-town day bag',
      'Railjet seat reservation',
      'Hotel essentials kept accessible',
      'Warm layer for the platform',
    ],
  },

  '2037-09-14': {
    isoDate: '2037-09-14',
    date: 'Sept 14',
    dayLabel: 'Day 10 — Monday',
    title: 'Departure',
    phaseId: 'olperer',
    activities: [
      { time: '5:30 AM', title: 'Check out Vienna Airport Hotel; walk to terminal (~5 min)', highlight: 'important' },
      { time: '6:00 AM', title: 'Check-in and security at VIE', highlight: 'important' },
      {
        time: '8:00 AM',
        title: 'VIE → FRA (EX 200, 1h30m; arrive 9:30 AM)',
        highlight: 'important',
        type: 'flight',
        segmentId: 'vie-fra',
      },
      {
        time: '10:45 AM',
        title: 'FRA → ORIGIN (EX 201, sample long-haul segment)',
        highlight: 'important',
        type: 'flight',
        segmentId: 'fra-origin',
      },
      { time: '11:55 AM', title: 'Arrive at the sample origin airport', highlight: 'important', type: 'flight' },
    ],
    weather:
      'Vienna Airport mornings are usually cool, around the low-to-mid teens °C, before warming later in the day.',
    weatherNote: 'You only need airport-comfort layers here, but keep the shell accessible in your personal item.',
    weatherSource: 'historical',
    weatherLocation: { name: 'Vienna Airport', coordinates: { lat: 48.1103, lng: 16.5697 } },
    carryToday: ['Passport', 'Liquids bag', 'Chargers and power bank', 'Shell in personal item'],
  },
}
