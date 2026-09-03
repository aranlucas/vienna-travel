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
  {
    item: 'Flight SEA → VIE → SEA (LH489 + OS186 / OS203 + LH490)',
    booked: true,
    note: 'Outbound Austrian-operated OS186 is also sold as Lufthansa codeshare LH6390 · MUC connection 1h 50m · FRA return connection 1h 15m',
  },
  {
    item: s.vienna.bookingLabel,
    booked: s.vienna.confirmed,
    note: `${s.vienna.room} · ${s.vienna.guests}`,
  },
  {
    item: s.zimmerbraeu.bookingLabel,
    booked: s.zimmerbraeu.confirmed,
    note: `${s.zimmerbraeu.room} · ${s.zimmerbraeu.guests}`,
  },
  {
    item: 'SIXT rental car: Salzburg Centre → Innsbruck Airport (Sept 7–12)',
    booked: true,
    note: 'VW T-Cross or similar (automatic) · Pickup Sept 7 at 12:00 PM · Return Sept 12 at 5:30 PM · Stay Flexible · one driver · confirm Germany / Zone 1 authorization and the current rental insurance terms before pickup',
    actionLabel: 'Manage SIXT booking',
    actionUrl: 'https://www.sixt.com/account/#/booking-access',
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
    item: s['nh-airport'].bookingLabel,
    booked: s['nh-airport'].confirmed,
    note: s['nh-airport'].note,
    actionLabel: s['nh-airport'].actionLabel,
    actionUrl: s['nh-airport'].actionUrl,
  },
  {
    item: 'Schafbergbahn time slot (Sept 8 afternoon)',
    booked: true,
    note: 'Booked · keep the time-slot confirmation handy and recheck summit weather before departure',
    actionLabel: 'Open Schafbergbahn',
    actionUrl: 'https://www.5schaetze.at/en/schafberg-bahn/',
  },
  {
    item: 'ÖBB Vienna Hbf → Salzburg Hbf (Sept 7 morning)',
    booked: false,
    deadline: 'Book now',
    note: 'No outbound train booking is recorded. Choose a direct morning Railjet scheduled to reach Salzburg by 11:00 AM, preserve at least 45 minutes before the confirmed 12:00 PM SIXT pickup, and add seat reservations.',
    actionLabel: 'Book with ÖBB',
    actionUrl: 'https://www.oebb.at/en/',
  },
  {
    item: 'Hallstatt Salzbergbahn / Skywalk-only first ascent (Sept 8)',
    booked: true,
    note: 'Booked; details kept with traveler. Choose the 9:00 AM funicular + Skywalk option, not a salt-mine combination; the mine tour cannot fit the fixed 10:15 AM Hallstatt departure.',
    actionLabel: 'Check official tickets and hours',
    actionUrl: 'https://www.salzwelten.at/en/hallstatt/prices-opening-hours',
  },
  {
    item: 'ÖBB RJX 13479 dep 14:56 Innsbruck → Vienna Airport (Sept 13)',
    booked: true,
    note: '1st class · passenger and reservation details are kept with the traveler',
  },
]

// ── Pre-departure checklist ───────────────────────────────────────────────────

export const CHECKLIST: { item: string; critical: boolean }[] = [
  { item: 'Tonight after 7:50 PM PT: check in with Lufthansa for LH489 + OS186, verify both names and passport details, choose seats, and save both boarding passes offline', critical: true },
  { item: 'Friday flight plan: be inside SEA by 3:50 PM PT for the 6:50 PM international departure; recheck LH489, the departure gate, and live SEA checkpoint waits before leaving home', critical: true },
  { item: 'Entry documents: each passport must have been issued within the last 10 years and stay valid through at least Dec 14, 2026; ETIAS is not operating yet, so do not pay an unofficial application site', critical: true },
  { item: 'Munich transfer: go directly to OS186 after landing; the 1h 50m connection includes Schengen passport control and EES registration, so keep passports ready and confirm bags are checked through to VIE', critical: true },
  { item: 'Book the still-unrecorded Sept 7 direct ÖBB Railjet today: choose a train arriving Salzburg by 11:00 AM and add seat reservations to protect the noon SIXT pickup', critical: true },
  { item: 'Save an offline travel folder on both phones: flight, hotel, rail, rental, and activity confirmations; travel insurance and emergency contacts; passport copies; and the Almanac address', critical: true },
  { item: 'Arrival connectivity: install and test the eSIM or roaming plan, download Vienna and Austria offline maps, and separate two usable payment cards plus a little euro cash between both travelers', critical: true },
  { item: 'Under-seat essentials: passports, prescriptions, phones, charging cables, power banks, valuables, one warm layer, and a minimal overnight change; keep power banks out of checked bags and overhead bins', critical: true },
  { item: 'Home close-out Friday: keys and wallet accounted for, windows and doors locked, thermostat set, nonessential appliances unplugged, and any mail, plant, or pet coverage confirmed', critical: false },
  { item: 'Cash: €150–200 total in smaller notes, split between both people for Coburger Hütte, Olpererhütte, and toll backup', critical: true },
  { item: 'Pack the full alpine layer system: base layer + fleece + packable insulation + waterproof shell; Zugspitze can be near or below freezing while the valley is warm', critical: true },
  { item: 'Rain protection: reproof hiking shoes, test both shells, and pack rain pants plus one waterproof liner per daypack', critical: true },
  { item: 'Mountain safety: each person carries 2 L water capacity, a headlamp, and a space blanket; split first aid and the power bank between daypacks', critical: true },
  { item: 'Mountain weather routine: recheck the official local forecast and lift, road, hut, and trail status 24–48 hours ahead and again before leaving each morning', critical: true },
  { item: 'Final bag check on Sept 3: rollers 6.5–7 kg, personal-item daypacks within 40 × 30 × 15 cm, no batteries or essential medicine in a gate-checkable roller', critical: true },
  { item: 'Rental coverage: download the current Chase benefit letter, confirm the primary renter and full-card-payment rules, and remember that collision/theft coverage is not liability insurance', critical: true },
  { item: 'Confirm a valid Austrian vignette on the rental car at pickup; if absent, buy an immediate-valid 10-day vignette before using the autobahn', critical: true },
  { item: 'Keep €1/€2 coins handy for station restrooms and small kiosks', critical: false },
  { item: 'Schafbergbahn: booked ✓ — keep the time-slot confirmation handy', critical: false },
  { item: 'RJX 13479 (Sept 13, dep 14:56): booked ✓ — keep passenger details with the traveler', critical: false },
  { item: 'Arrival supplies: buy hiking snacks at VIE or Wien Mitte before hotel check-in; do not depend on Naschmarkt stalls', critical: true },
  { item: 'Use the ÖBB Scotty/app for live platform and delay updates on long train days', critical: true },
  { item: 'Download offline maps before the Tyrol and Zillertal hike days; replace the Seebensee valley-start reference GPX with a gondola-start route before Sept 10', critical: true },
  { item: 'Schlegeis Alpine Road: buy the €19 passenger-car day ticket online and recheck parking / traffic-control status', critical: true },
  { item: 'Innsbruck Airport return: passenger cars use parking area A; follow the blue “Car rental return” signs', critical: true },
  { item: 'Return flight connection at FRA is only 75 minutes: keep both boarding passes ready, confirm bags are through-checked, and go directly to transfer/passport control', critical: true },
  { item: 'Choose the Sept 6 museum now: KHM, Albertina, and Belvedere are paid; the first-Sunday offer belongs to the Wien Museum network, not all federal museums', critical: true },
  { item: 'Keep the Hotel Zimmerbräu and der grüne Baum confirmations handy for Sept 7 and Sept 9 check-in windows', critical: false },
]

// ── Live checks & reservations ────────────────────────────────────────────────

export const LIVE_CHECKS: LiveCheckItem[] = [
  {
    id: 'hallstatt-access',
    title: 'Hallstatt Skywalk / Salzberg access',
    dueDate: '2026-09-05',
    scope: 'Salzkammergut',
    kind: 'Live Check',
    description: 'Reconfirm the booked 9:00 AM first ascent, current parking pattern, and first-week funicular status before Tuesday, Sept 8, 2026.',
    note: 'The rebuilt Salzbergbahn officially reopened Aug 29. Keep this to the Skywalk-only visit; if operations change, use the lakeside old-town promenade and still leave Hallstatt on time.',
  },
  {
    id: 'schafbergbahn-status',
    title: 'Schafbergbahn operating status',
    dueDate: '2026-09-06',
    scope: 'Salzkammergut',
    kind: 'Live Check',
    description: 'Recheck the mountain railway operating status and summit weather for the booked Sept 8 afternoon ride.',
    note: 'Use the exact ascent and return times on the booking confirmation. If low cloud, sustained rain, or wind threatens operations, keep the Hallstatt morning and replace the summit with a lower St. Wolfgang or Bad Ischl afternoon.',
  },
  {
    id: 'seebensee-conditions',
    title: 'Seebensee / Coburger Hütte conditions',
    dueDate: '2026-09-09',
    scope: 'Tyrol',
    kind: 'Live Check',
    description: 'Check Ehrwalder Almbahn operations, Coburger Hütte status, trail conditions, and the mountain forecast before the Sept 10 hike.',
    note: 'If the upper trail is unsafe or cloud and rain erase the value, cap the day at Ehrwalder Alm or Seebensee instead of forcing the steeper Drachensee and hut section. Use a gondola-start offline route; the site GPX is clearly labeled as a valley-start reference.',
  },
  {
    id: 'zugspitzbahn-status',
    title: 'Zugspitzbahn weather and visibility check',
    dueDate: '2026-09-08',
    scope: 'Tyrol',
    kind: 'Live Check',
    description: 'Look at summit visibility, wind, and railway operating notes before the Sept 11 summit day.',
    note: 'If the summit is washed out, give the 3-Lake Loop more time and treat Zugspitze as optional.',
  },
  {
    id: 'olperer-conditions',
    title: 'Olperer trail conditions and Schlegeis road access',
    dueDate: '2026-09-09',
    scope: 'Olpererhütte',
    kind: 'Live Check',
    description: 'Check the alpine road, trail conditions, and weather warnings before the Sept 12 early-start hike.',
    note: 'This is the highest-risk logistics day. Recheck the 7:00 AM–6:00 PM road window, parking control, and weather. If warnings, wet trail conditions, or poor visibility make the hut unwise, use the reservoir or a lower walk and protect the fixed 5:30 PM rental return.',
  },
  {
    id: 'vie-airport-morning-ops',
    title: 'Vienna Airport early-morning operations check',
    dueDate: '2026-09-13',
    scope: 'Departure',
    kind: 'Live Check',
    description: 'Check the VIE departures board and recommended security lead time for Monday, Sept 14 before sleeping.',
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
        label: "Wirtshaus 1644 at der grüne Baum",
        href: 'https://www.gruenerbaum.com/en/pleasure/restaurant/',
        note: 'In-house restaurant at your confirmed Ehrwald hotel — fine wines and Tyrolean classics. Path of least resistance after the Sept 10 big hike.',
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
