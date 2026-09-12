import { STAYS_BY_ID } from './stays'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BookingItem {
  item: string
  /** Last local date this reservation remains relevant. */
  endDate?: string
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
  endDate?: string
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
  links?: { label: string; href: string }[]
}

// ── Bookings ──────────────────────────────────────────────────────────────────
// Confirmed stays auto-derive booked: true from their stay.confirmed flag.
// Manual items handle transport, unconfirmed hotels, and activity reservations.

const s = STAYS_BY_ID

export const BOOKINGS: BookingItem[] = [
  {
    item: 'Flight SEA → VIE → SEA (LH489 + OS186 / OS203 + LH490)',
    booked: true,
    note: 'Return Monday Sept 14: OS203 departs VIE 08:00; LH490 departs FRA 10:45, with a 75-minute connection. Austrian online check-in normally opens Saturday 09:00 CEST; USA itinerary boarding passes are released no earlier than Sunday 08:00 CEST. Saved flight times must be checked against the airline app.',
    actionLabel: 'Return flight check-in',
    actionUrl: 'https://www.austrian.com/at/en/online-check-in',
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
    endDate: '2026-09-12',
    note: 'VW T-Cross or similar (automatic) · Pickup Sept 7 at 12:00 PM · Return Sept 12 at 5:30 PM at Innsbruck Airport. Allow time to refuel, photograph the car and fuel level, remove belongings and keep the return receipt.',
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
    item: 'Schafbergbahn return tickets (Sept 8 · 9:15 up / 12:05 down)',
    endDate: '2026-09-08',
    booked: false,
    note: 'Planned daily services, not reserved. €61 per adult return. Confirm seats and both departures before payment.',
    actionLabel: 'Open Schafbergbahn',
    actionUrl: 'https://www.5schaetze.at/en/Info_SchafbergBahn_and_WolfgangseeSchifffahrt.html',
  },
  {
    item: 'ÖBB Vienna Hbf → Salzburg Hbf (Sept 7 morning)',
    endDate: '2026-09-07',
    booked: false,
    deadline: 'Book now',
    note: 'No outbound train booking is recorded. Choose a direct morning Railjet scheduled to reach Salzburg by 11:00 AM, preserve at least 45 minutes before the confirmed 12:00 PM SIXT pickup, and add seat reservations.',
    actionLabel: 'Book with ÖBB',
    actionUrl: 'https://www.oebb.at/en/',
  },
  {
    item: 'Two e-trekking bikes (Sept 8 afternoon)',
    endDate: '2026-09-08',
    booked: false,
    note: 'Pro Travel first choice: €72 for two/day, locks included. Call +43 6138 2525 for next-day availability, helmets and agreed 14:00 pickup / 17:30 return. See-Biker fallback €78 for two/afternoon, walk-in stock unconfirmed.',
    actionLabel: 'Rental details',
    actionUrl: 'https://www.protravel.at/radverleih/',
  },
  {
    item: 'ÖBB RJX 13479 dep 14:56 Innsbruck → Vienna Airport (Sept 13)',
    endDate: '2026-09-13',
    booked: true,
    note: '1st class and seats recorded as booked. Collect luggage and finish shopping by 14:00; follow the actual train, coach and platform in ÖBB. Arrival ~19:55 is approximate in the saved plan. Keep private ticket details offline.',
    actionLabel: 'Check live train details',
    actionUrl: 'https://fahrplan.oebb.at/',
  },
]

// ── Pre-departure checklist ───────────────────────────────────────────────────

export const CHECKLIST: { item: string; critical: boolean }[] = [
  {
    item: 'Tonight after 7:50 PM PT: check in with Lufthansa for LH489 + OS186, verify both names and passport details, choose seats, and save both boarding passes offline',
    critical: true,
  },
  {
    item: 'Friday flight plan: be inside SEA by 3:50 PM PT for the 6:50 PM international departure; recheck LH489, the departure gate, and live SEA checkpoint waits before leaving home',
    critical: true,
  },
  {
    item: 'Entry documents: each passport must have been issued within the last 10 years and stay valid through at least Dec 14, 2026; ETIAS is not operating yet, so do not pay an unofficial application site',
    critical: true,
  },
  {
    item: 'Munich transfer: go directly to OS186 after landing; the 1h 50m connection includes Schengen passport control and EES registration, so keep passports ready and confirm bags are checked through to VIE',
    critical: true,
  },
  {
    item: 'Book the still-unrecorded Sept 7 direct ÖBB Railjet today: choose a train arriving Salzburg by 11:00 AM and add seat reservations to protect the noon SIXT pickup',
    critical: true,
  },
  {
    item: 'Save an offline travel folder on both phones: flight, hotel, rail, rental, and activity confirmations; travel insurance and emergency contacts; passport copies; and the Almanac address',
    critical: true,
  },
  {
    item: 'Arrival connectivity: install and test the eSIM or roaming plan, download Vienna and Austria offline maps, and separate two usable payment cards plus a little euro cash between both travelers',
    critical: true,
  },
  {
    item: 'Under-seat essentials: passports, prescriptions, phones, charging cables, power banks, valuables, one warm layer, and a minimal overnight change; keep power banks out of checked bags and overhead bins',
    critical: true,
  },
  {
    item: 'Home close-out Friday: keys and wallet accounted for, windows and doors locked, thermostat set, nonessential appliances unplugged, and any mail, plant, or pet coverage confirmed',
    critical: false,
  },
  {
    item: 'Cash: €150–200 total in smaller notes, split between both people for earlier hut visits, parking and payment backup',
    critical: true,
  },
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
    item: 'Final bag check on Sept 3: rollers 6.5–7 kg, personal-item daypacks within 40 × 30 × 15 cm, no batteries or essential medicine in a gate-checkable roller',
    critical: true,
  },
  {
    item: 'Rental coverage: download the current Chase benefit letter, confirm the primary renter and full-card-payment rules, and remember that collision/theft coverage is not liability insurance',
    critical: true,
  },
  {
    item: 'Confirm a valid Austrian vignette on the rental car at pickup; if absent, buy an immediate-valid 10-day vignette before using the autobahn',
    critical: true,
  },
  { item: 'Keep €1/€2 coins handy for station restrooms and small kiosks', critical: false },
  { item: 'Schafbergbahn: reserve Sept 8 morning ascent and noon descent; nothing booked yet', critical: false },
  { item: 'RJX 13479 (Sept 13, dep 14:56): booked ✓ — keep passenger details with the traveler', critical: false },
  {
    item: 'Arrival supplies: buy hiking snacks at VIE or Wien Mitte before hotel check-in; do not depend on Naschmarkt stalls',
    critical: true,
  },
  { item: 'Use the ÖBB Scotty/app for live platform and delay updates on long train days', critical: true },
  {
    item: 'Download offline maps before the Tyrol hikes and Achensee day trip; replace the Seebensee valley-start reference GPX with a gondola-start route before Sept 10',
    critical: true,
  },
  {
    item: 'Achensee day trip: save Pertisau parking and navigation, leave at 14:30 for the fixed 17:30 Innsbruck Airport car return',
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
  {
    item: 'Keep the Hotel Zimmerbräu and der grüne Baum confirmations handy for Sept 7 and Sept 9 check-in windows',
    critical: false,
  },
]

// ── Live checks & reservations ────────────────────────────────────────────────

export const LIVE_CHECKS: LiveCheckItem[] = [
  {
    id: 'bike-swim-confirmation',
    title: 'Bike rental and Felmayerbad opening',
    dueDate: '2026-09-07',
    scope: 'Salzkammergut',
    kind: 'Reservation',
    description:
      'Call Pro Travel for two bikes, frame sizes, helmets, 14:00 collection and 17:30 return. Online next-day reservations are not accepted.',
    note: 'Felmayerbad is the named swim stop. September is in the published beach-card season; exact daily gate hours are unpublished. Municipal contact +43 6137 7256. See-Biker only accepts reservations from one day.',
  },
  {
    id: 'schafbergbahn-status',
    title: 'Schafbergbahn seats and morning weather',
    dueDate: '2026-09-08',
    scope: 'Salzkammergut',
    kind: 'Live Check',
    description:
      'Reserve the published 9:15 ascent and 12:05 descent only after checking seat availability and summit conditions.',
    note: 'No reservation exists. If the morning service is unavailable, keep the afternoon bike + swim plan and use a local morning walk. Do not silently shift the train into the rental window.',
  },
  {
    id: 'seebensee-conditions',
    title: 'Seebensee / Coburger Hütte conditions',
    dueDate: '2026-09-09',
    scope: 'Tyrol',
    kind: 'Live Check',
    description:
      'Check Ehrwalder Almbahn operations, Coburger Hütte status, trail conditions, and the mountain forecast before the Sept 10 hike.',
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
    id: 'achensee-day-trip',
    title: 'Achensee day trip · leave Pertisau at 14:30',
    dueDate: '2026-09-12',
    scope: 'Pertisau',
    kind: 'Live Check',
    description:
      'Check the lakeside weather and current driving time before leaving. Use paid promenade parking, keep the stroll short, and have lunch close to the car.',
    note: 'Departure target 09:30; return drive 14:30. Allow up to 90 minutes back toward Innsbruck, plus refuelling and the 17:00 return-area target for the fixed 17:30 rental deadline. Shorten the visit if traffic builds.',
    links: [
      {
        label: 'Pertisau lakeside parking',
        href: 'https://www.achensee.com/de/map-winter/uferpromenade-pertisau-1-17551943/',
      },
      { label: 'Achensee weather and webcams', href: 'https://www.achensee.com/de/live/wetter/' },
    ],
  },
  {
    id: 'return-flight-checkin',
    title: 'Check in for Monday’s flights',
    dueDate: '2026-09-13',
    scope: 'Departure',
    kind: 'Live Check',
    description:
      'Online check-in normally opens Saturday at 09:00 CEST for Monday’s 08:00 OS203. Because this itinerary includes the USA, boarding passes are available no earlier than Sunday at 08:00 CEST.',
    note: 'Save both legs for both travelers offline on Sunday. If the app requires document checks, allow for the staffed desk at VIE. No check-in has been completed by this plan.',
    links: [
      {
        label: 'Austrian check-in and USA boarding-pass rules',
        href: 'https://www.austrian.com/at/en/online-check-in',
      },
    ],
  },
  {
    id: 'innsbruck-car-return',
    title: 'Saturday rental return · 17:30',
    dueDate: '2026-09-12',
    scope: 'Innsbruck',
    kind: 'Live Check',
    description:
      'Aim to reach the airport return area by 17:00 after refuelling. The saved SIXT return time is 17:30; leave room for finding the bay and completing the handover.',
    note: 'Photograph condition and fuel level, remove belongings, keep the receipt and follow the branch’s key-return instructions. Take the next posted F bus back to the city, or a taxi if tired.',
    links: [
      { label: 'SIXT return directions', href: 'https://www.sixt.com/car-rental/austria/innsbruck/innsbruck-airport/' },
    ],
  },
  {
    id: 'innsbruck-luggage-rail',
    title: 'Sunday luggage and airport train',
    dueDate: '2026-09-13',
    scope: 'Innsbruck',
    kind: 'Live Check',
    description:
      'Check out and store bags at Innsbruck Hbf before the old-town walk. Lockers are subject to availability; do not assume Urban Inn has a staffed luggage desk.',
    note: 'Collect bags and finish train-food shopping by 14:00 for the recorded 14:56 service. Check the actual train and destination in ÖBB. If it is disrupted, ask ÖBB staff for a replacement route to Flughafen Wien before committing to another ticket.',
    links: [
      { label: 'ÖBB live journey planner', href: 'https://fahrplan.oebb.at/' },
      { label: 'Station lockers', href: 'https://bahnhofcityinnsbruck.oebb.at/de/services/schliessfaecher' },
      { label: 'Sunday station food', href: 'https://bahnhof.oebb.at/en/tirol/innsbruck-hauptbahnhof' },
    ],
  },
  {
    id: 'vie-airport-morning-ops',
    title: 'Vienna Airport early-morning operations check',
    dueDate: '2026-09-13',
    scope: 'Departure',
    kind: 'Live Check',
    description:
      'At NH on Sunday evening, check OS203 and LH490, save boarding passes, settle checkout arrangements and set two alarms. Arrange an early breakfast or carry food; do not wait for the main buffet.',
    note: 'Hand luggage: wake 05:00, leave NH 05:15, terminal 05:30. Checked bag: wake 04:30, leave 04:45, terminal 05:00. Follow any earlier airline instructions. Confirm bag routing to SEA and the Frankfurt boarding deadline.',
    links: [
      { label: 'Vienna departures', href: 'https://www.viennaairport.com/en/passengers/arrival__departure/departures' },
      { label: 'Austrian check-in', href: 'https://www.austrian.com/at/en/online-check-in' },
      {
        label: 'Airport arrival guidance',
        href: 'https://viennaairport.com/en/passengers/arrival__departure/tips_for_departure',
      },
    ],
  },
  {
    id: 'fra-transfer',
    title: 'Monday Frankfurt connection · 75 minutes',
    dueDate: '2026-09-14',
    scope: 'Departure',
    kind: 'Live Check',
    description:
      'On landing, follow the current LH490 gate and transfer signs directly. Allow for Schengen exit passport control and any additional screening; walking and boarding consume part of the connection.',
    note: 'Keep passports and both boarding passes in hand. Confirm any checked bag is tagged to SEA at VIE. If the inbound flight is late, tell the crew and use Lufthansa transfer assistance; do not stop for shopping or a lounge.',
    links: [
      {
        label: 'Frankfurt transfer guide',
        href: 'https://www.frankfurt-airport.com/en/flights-and-transfer/transferring-at-fra.html',
      },
    ],
  },
]

// ── Planning shortlist ────────────────────────────────────────────────────────

export const PLANNING_SHORTLIST: PlanningShortlistItem[] = [
  {
    id: 'restaurants-vienna',
    endDate: '2026-09-07',
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
    endDate: '2026-09-11',
    title: 'Ehrwald dinner picks for the hike nights',
    area: 'Zugspitz Arena · Ehrwald / Lermoos',
    why: 'Sept 9–11 is hard-hiking territory. Pre-pick one or two Tyrolean dinner spots so you are not decision-fatigued after the Seebensee descent or the 3-Lake Loop.',
    priority: 'Nice to have',
    options: [
      {
        label: 'Wirtshaus 1644 at der grüne Baum',
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
    endDate: '2026-09-13',
    title: 'Innsbruck: Saturday dinner and Sunday lunch',
    area: 'Altstadt + around Hbf',
    why: 'Saturday dinner at Die Wilderin if a table is available; Sunday lunch at Stiftskeller at 11:30. Finish before the optional Hofkirche visit and 14:56 train. Hours checked Sept 12; no tables reserved.',
    priority: 'Soon',
    options: [
      {
        label: 'Die Wilderin',
        href: 'https://www.diewilderin.at/',
        note: 'Saturday dinner target 19:15, subject to a table. Innsbruck Tourism lists weekend opening from 17:00; it cannot serve lunch before Sunday’s train.',
      },
      {
        label: 'Stiftskeller Innsbruck',
        href: 'https://www.stiftskeller.eu/en/opening-hours',
        note: 'Sunday lunch target 11:30; daily kitchen 11:00–22:00. Also a Saturday dinner fallback. Skip Hofkirche if lunch takes longer than expected.',
      },
      {
        label: 'Hbf: Ruetz breakfast and MPREIS train food',
        href: 'https://bahnhof.oebb.at/en/tirol/innsbruck-hauptbahnhof',
        note: 'ÖBB lists Ruetz daily 05:00–20:00 and MPREIS daily 06:00–21:00, including Sunday. Use for breakfast or takeaway if storage or lunch runs late.',
      },
    ],
  },
  {
    id: 'airport-evening',
    endDate: '2026-09-14',
    title: 'Sunday airport dinner and Monday breakfast',
    area: 'NH Vienna Airport Conference Center',
    why: 'Keep the last night close to the terminal and get to sleep around 21:15. The train’s ~19:55 arrival leaves a short hotel evening; carry food in case of delays.',
    priority: 'Soon',
    options: [
      {
        label: 'Mundo dinner and early-bird breakfast',
        href: 'https://www.nh-hotels.com/en/hotel/nh-vienna-airport-conference-center/restaurants',
        note: 'Aim for dinner around 20:30; the à la carte menu is published until 22:00. Ask reception about early-bird breakfast availability and cost; do not assume it is included.',
      },
      {
        label: 'Walk from the station to NH',
        href: 'https://www.nh-hotels.com/en/hotel/nh-vienna-airport-conference-center/map',
        note: 'Einfahrtsstrasse 1–3. Hotel-to-airport walk is published as six minutes; allow 20 minutes from the train platform to reception with luggage.',
      },
    ],
  },
]
