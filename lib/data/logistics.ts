import { STAYS_BY_ID } from './stays'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BookingItem {
  item: string
  booked: boolean
  note?: string
  deadline?: string
  actionLabel?: string
  actionUrl?: string
}

export interface PlanningOption {
  label: string
  href: string
  note?: string
}

export interface PlanningShortlistItem {
  id: string
  title: string
  area: string
  why: string
  priority: 'Book now' | 'Soon' | 'Nice to have'
  options: PlanningOption[]
}

export interface LiveCheckItem {
  id: string
  title: string
  dueDate: string
  scope: string
  kind: 'Live Check' | 'Reservation'
  description: string
  note?: string
}

// ── Bookings ──────────────────────────────────────────────────────────────────
// Confirmed stays auto-derive booked: true from their stay.confirmed flag.
// Manual items handle transport, unconfirmed hotels, and activity reservations.

const s = STAYS_BY_ID

export const BOOKINGS: BookingItem[] = [
  { item: 'Sample flight ORIGIN → VIE → ORIGIN (EX 100 / EX 101)', booked: true },
  {
    item: s.vienna.bookingLabel,
    booked: s.vienna.confirmed,
    note: `${s.vienna.room} · ${s.vienna.guests}`,
  },
  {
    item: s.lakeside.bookingLabel,
    booked: s.lakeside.confirmed,
    note: `${s.lakeside.room} · ${s.lakeside.guests}`,
  },
  {
    item: 'Sample rental car: Salzburg → Innsbruck Airport (Sept 7–12)',
    booked: true,
    note: 'Fictional booking fixture · verify cross-border authorization, vignette, and insurance terms for a real rental',
  },
  {
    item: s.ehrwald.bookingLabel,
    booked: s.ehrwald.confirmed,
    note: `${s.ehrwald.room} · ${s.ehrwald.guests}`,
  },
  {
    item: s.innsbruck.bookingLabel,
    booked: s.innsbruck.confirmed,
    note: `${s.innsbruck.room} · ${s.innsbruck.guests}`,
  },
  {
    item: s.airport.bookingLabel,
    booked: s.airport.confirmed,
    note: s.airport.note,
    actionLabel: s.airport.actionLabel,
    actionUrl: s.airport.actionUrl,
  },
  {
    item: 'Schafbergbahn time slot (Sept 8 afternoon)',
    booked: true,
    note: 'Marked booked for the demo · verify availability and summit weather for a real trip',
    actionLabel: 'Open Schafbergbahn',
    actionUrl: 'https://www.5schaetze.at/en/schafberg-bahn/',
  },
  {
    item: 'ÖBB Vienna Hbf → Salzburg Hbf (Sept 7 morning)',
    booked: false,
    deadline: 'Book now',
    note: 'Sample unbooked item. Choose a direct morning Railjet that reaches Salzburg by 11:00 AM and leaves at least 45 minutes before rental pickup.',
    actionLabel: 'Book with ÖBB',
    actionUrl: 'https://www.oebb.at/en/',
  },
  {
    item: 'Hallstatt Salzbergbahn / Skywalk-only first ascent (Sept 8)',
    booked: true,
    note: 'Marked booked for the demo. Verify current hours and choose an itinerary that fits the available ticket options.',
    actionLabel: 'Check official tickets and hours',
    actionUrl: 'https://www.salzwelten.at/en/hallstatt/prices-opening-hours',
  },
  {
    item: 'ÖBB Railjet dep 14:56 Innsbruck → Vienna Airport (Sept 13)',
    booked: true,
    note: 'Fictional reservation used to demonstrate booked transport state',
  },
]

// ── Pre-departure checklist ───────────────────────────────────────────────────

export const CHECKLIST: { item: string; critical: boolean }[] = [
  { item: 'Carry an appropriate cash backup in smaller notes for huts and tolls', critical: true },
  {
    item: 'Pack the full alpine layer system: base layer + fleece + packable insulation + waterproof shell; Zugspitze can be near or below freezing while the valley is warm',
    critical: true,
  },
  {
    item: 'Rain protection: reproof hiking shoes, test both shells, and pack rain pants plus one waterproof liner per daypack',
    critical: true,
  },
  {
    item: 'Mountain safety: each person carries 2 L water capacity, a headlamp, and a space blanket; split first aid and the power bank between daypacks',
    critical: true,
  },
  {
    item: 'Mountain weather routine: recheck the official local forecast and lift, road, hut, and trail status 24–48 hours ahead and again before leaving each morning',
    critical: true,
  },
  {
    item: "Final bag check on Sept 3: confirm the operating carrier's current size and weight limits; keep batteries and essential medicine in the personal item",
    critical: true,
  },
  {
    item: 'Rental coverage: confirm the primary-renter, payment, collision, theft, and liability terms before pickup',
    critical: true,
  },
  {
    item: 'Confirm a valid Austrian vignette on the rental car at pickup; if absent, buy an immediate-valid 10-day vignette before using the autobahn',
    critical: true,
  },
  { item: 'Keep €1/€2 coins handy for station restrooms and small kiosks', critical: false },
  { item: 'Sample Schafbergbahn slot: marked booked for the demo', critical: false },
  { item: 'Sample direct Railjet (Sept 13, dep 14:56): marked booked for the demo', critical: false },
  {
    item: 'Arrival supplies: buy hiking snacks at VIE or Wien Mitte before hotel check-in; do not depend on Naschmarkt stalls',
    critical: true,
  },
  { item: 'Use the ÖBB Scotty/app for live platform and delay updates on long train days', critical: true },
  {
    item: 'Download offline maps before the Tyrol and Zillertal hike days; replace the Seebensee valley-start reference GPX with a gondola-start route before Sept 10',
    critical: true,
  },
  {
    item: 'Schlegeis Alpine Road: buy the €19 passenger-car day ticket online and recheck parking / traffic-control status',
    critical: true,
  },
  {
    item: 'Innsbruck Airport return: passenger cars use parking area A; follow the blue “Car rental return” signs',
    critical: true,
  },
  {
    item: 'Return flight connection at FRA is only 75 minutes: keep both boarding passes ready, confirm bags are through-checked, and go directly to transfer/passport control',
    critical: true,
  },
  {
    item: 'Choose the Sept 6 museum now: KHM, Albertina, and Belvedere are paid; the first-Sunday offer belongs to the Wien Museum network, not all federal museums',
    critical: true,
  },
  { item: 'For a real trip, keep lodging confirmations offline and outside the repository', critical: false },
]

// ── Live checks & reservations ────────────────────────────────────────────────

export const LIVE_CHECKS: LiveCheckItem[] = [
  {
    id: 'hallstatt-access',
    title: 'Hallstatt Skywalk / Salzberg access',
    dueDate: '2037-09-05',
    scope: 'Salzkammergut',
    kind: 'Live Check',
    description:
      'Verify the first-ascent time, current parking pattern, and funicular status before Tuesday, Sept 8, 2037.',
    note: 'This is demo planning guidance, not a current operating-status claim. Use the official source before travel.',
  },
  {
    id: 'schafbergbahn-status',
    title: 'Schafbergbahn operating status',
    dueDate: '2037-09-06',
    scope: 'Salzkammergut',
    kind: 'Live Check',
    description:
      'Recheck the mountain railway operating status and summit weather for the sample Sept 8 afternoon ride.',
    note: 'Use the times on a real ticket. If low cloud, sustained rain, or wind threatens operations, use a lower-elevation alternative.',
  },
  {
    id: 'seebensee-conditions',
    title: 'Seebensee / Coburger Hütte conditions',
    dueDate: '2037-09-09',
    scope: 'Tyrol',
    kind: 'Live Check',
    description:
      'Check Ehrwalder Almbahn operations, Coburger Hütte status, trail conditions, and the mountain forecast before the Sept 10 hike.',
    note: 'If the upper trail is unsafe or cloud and rain erase the value, cap the day at Ehrwalder Alm or Seebensee instead of forcing the steeper Drachensee and hut section. Use a gondola-start offline route; the site GPX is clearly labeled as a valley-start reference.',
  },
  {
    id: 'zugspitzbahn-status',
    title: 'Zugspitzbahn weather and visibility check',
    dueDate: '2037-09-08',
    scope: 'Tyrol',
    kind: 'Live Check',
    description: 'Look at summit visibility, wind, and railway operating notes before the Sept 11 summit day.',
    note: 'If the summit is washed out, give the 3-Lake Loop more time and treat Zugspitze as optional.',
  },
  {
    id: 'olperer-conditions',
    title: 'Olperer trail conditions and Schlegeis road access',
    dueDate: '2037-09-09',
    scope: 'Olpererhütte',
    kind: 'Live Check',
    description: 'Check the alpine road, trail conditions, and weather warnings before the Sept 12 early-start hike.',
    note: 'This is the highest-risk logistics day. Recheck the 7:00 AM–6:00 PM road window, parking control, and weather. If warnings, wet trail conditions, or poor visibility make the hut unwise, use the reservoir or a lower walk and protect the fixed 5:30 PM rental return.',
  },
  {
    id: 'vie-airport-morning-ops',
    title: 'Vienna Airport early-morning operations check',
    dueDate: '2037-09-13',
    scope: 'Departure',
    kind: 'Live Check',
    description:
      'Check the VIE departures board and recommended security lead time for Monday, Sept 14 before sleeping.',
    note: 'If lines are trending long, move wake-up and bag-drop 20–30 minutes earlier.',
  },
]

// ── Planning shortlist ────────────────────────────────────────────────────────

export const PLANNING_SHORTLIST: PlanningShortlistItem[] = [
  {
    id: 'restaurants-vienna',
    title: 'Dinner reservations in Vienna',
    area: 'Innere Stadt / Stadtpark / Naschmarkt belt',
    why: 'September weekend tables in core districts can sell out, especially for classic Austrian spots.',
    priority: 'Soon',
    options: [
      {
        label: 'Steirereck im Stadtpark',
        href: 'https://www.steirereck.at/en/',
        note: 'High-end tasting destination near your hotel and city walk loop.',
      },
      {
        label: 'Plachutta Wollzeile',
        href: 'https://plachuttawollzeile.pide.at/en',
        note: 'Classic Viennese tafelspitz in the first district.',
      },
      {
        label: 'Figlmüller Wollzeile',
        href: 'https://figlmueller.at/en/wollzeile/',
        note: 'Iconic schnitzel option; reserve to avoid queue time.',
      },
    ],
  },
  {
    id: 'restaurants-ehrwald',
    title: 'Ehrwald dinner picks for the hike nights',
    area: 'Zugspitz Arena · Ehrwald / Lermoos',
    why: 'Sept 9–11 is hard-hiking territory. Pre-pick one or two Tyrolean dinner spots so you are not decision-fatigued after the Seebensee descent or the 3-Lake Loop.',
    priority: 'Nice to have',
    options: [
      {
        label: 'Wirtshaus 1644 at Tyrol Mountain Hotel',
        href: 'https://www.zugspitzarena.com/en/Enjoy/Restaurants-and-huts',
        note: 'Placeholder for a convenient restaurant near the sample Tyrol lodging.',
      },
      {
        label: 'Gasthof Zum Hechten',
        href: 'https://www.tripadvisor.com/Restaurants-g635548-Ehrwald_Tirol_Austrian_Alps.html',
        note: 'Classic village inn for schnitzel, goulash, Kaiserschmarrn. Affordable and hearty — fits a "legs tired, want dumplings" evening.',
      },
      {
        label: 'Panorama 2962 (Zugspitze summit)',
        href: 'https://zugspitze.at/en/kulinarik',
        note: 'Glass-walled restaurant on the summit platform. Time a late lunch with the Sept 11 cable car trip rather than treating as dinner.',
      },
    ],
  },
  {
    id: 'restaurants-innsbruck',
    title: 'Innsbruck Sunday lunch / dinner shortlist',
    area: 'Altstadt + around Hbf',
    why: 'You only have a half day in Innsbruck before the long train; pick one fixed meal target.',
    priority: 'Nice to have',
    options: [
      {
        label: 'Die Wilderin',
        href: 'https://www.diewilderin.at/',
        note: 'Regional-focused menu in the old town.',
      },
      {
        label: 'Stiftskeller Innsbruck',
        href: 'https://stiftskeller.eu/',
        note: 'Traditional Tyrolean setting close to major old-town sights.',
      },
      {
        label: 'Breakfast near station (Motel One Bar area)',
        href: 'https://www.motel-one.com/en/hotels/innsbruck/hotel-innsbruck/',
        note: 'Practical fallback if timing gets tight before the 14:56 departure.',
      },
    ],
  },
]
