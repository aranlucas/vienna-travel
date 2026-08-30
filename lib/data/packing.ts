export interface PackingGroup {
  title: string
  subtitle?: string
  items: string[]
  tone?: 'default' | 'warning' | 'info'
}

export interface PackingPlan {
  title: string
  intro: string
  baggageRule: string
  strategy: string
  groups: PackingGroup[]
}

export const PACKING_PLAN: PackingPlan = {
  title: 'Forecast-Ready Carry-On Packing',
  intro:
    'Pack for warm city and valley days, wet lake weather, two strenuous alpine hikes, and exposed rail-and-cable-car summits up to 2,962 m — all across a 10-day trip without checked bags. Use one cabin roller plus one trail-capable personal-item daypack each, with a laundry reset on Sept 9.',
  baggageRule:
    'Published Lufthansa and Austrian Economy / short-haul Economy Light allowance: 1 carry-on up to 8 kg (55 × 40 × 23 cm) plus 1 personal item (40 × 30 × 15 cm) per person. Confirm the same allowance appears on the booking because the operating carrier and fare shown on each segment control.',
  strategy:
    'Wear the hiking shoes and heaviest midlayer in transit. Keep each roller at 6.5–7 kg, make each 15–20 L daypack fit the personal-item dimensions, and keep passports, medicines, batteries, and valuables in that daypack in case the roller is gate-checked.',
  groups: [
    {
      title: 'Wear On Plane',
      subtitle: 'Best weight saver',
      tone: 'info',
      items: [
        'Broken-in, water-resistant hiking shoes with real tread',
        'City pants or travel trousers',
        'Breathable T-shirt',
        'Fleece or merino midlayer',
        'Waterproof hooded shell kept accessible, not buried',
      ],
    },
    {
      title: 'Clothing Capsule',
      subtitle: 'Total per person, including worn',
      items: [
        '5 underwear',
        '5 pairs of socks: 3 merino hiking + 2 light city/travel',
        '3 merino or quick-dry T-shirts',
        '1 nicer city top or shirt',
        '1 long-sleeve base layer',
        '1 fleece or warm midlayer',
        '1 lightweight packable insulated jacket or vest',
        '1 waterproof hooded shell',
        '1 quick-dry hiking pant',
        '1 city or travel pant',
        '1 shorts or leggings',
        '1 sleep set',
        '1 swimsuit',
        'Optional compact city shoe only if the roller stays below 7 kg',
      ],
    },
    {
      title: 'Alpine Non-Negotiables',
      subtitle: 'Per person for Sept 10–12',
      tone: 'warning',
      items: [
        '15–20 L comfortable daypack that also meets the personal-item limit',
        'Packable waterproof rain pants',
        'Warm hat or buff and light gloves',
        '2 L water capacity',
        'Small headlamp; do not rely only on a phone flashlight',
        'Sunglasses, SPF 30+ sunscreen, and SPF lip balm',
        'Charged phone with offline GPX plus Austrian emergency numbers 140 / 112',
      ],
    },
    {
      title: 'Rain Plan',
      subtitle: 'Shoulder-season wet-weather plan',
      tone: 'info',
      items: [
        'Reproof hiking shoes and test the shell before departure',
        '1 lightweight waterproof pack liner per daypack; a sturdy bag works better than only a rain cover',
        '1 compact umbrella for Vienna, train days, and towns — never as the mountain rain plan',
        'Quick-dry hiking pants; no jeans or cotton bottoms on alpine days',
        'Keep one full dry base layer in a waterproof bag on Sept 10 and Sept 12',
      ],
    },
    {
      title: 'Shared Safety & Trail Kit',
      subtitle: 'Split between the two daypacks',
      items: [
        'Blister kit, compact first aid, pain meds, bandages, and leukotape',
        '2 emergency space blankets — one per traveler',
        '1 reliable power bank and short charging cable',
        '2 EU plug adapters',
        'Trail food and electrolyte packets; restock snacks in Vienna',
        '€150–200 total in smaller notes, split between both people for huts and toll backup',
        'Tissues, a small trash bag, and a tiny amount of repair tape',
      ],
    },
    {
      title: 'Documents, Health & Tech',
      subtitle: 'Keep in personal items',
      items: [
        'Passports, flight and rail confirmations, rental documents, and driver’s license',
        'Travel insurance details and emergency contacts saved offline',
        'All prescription medicine plus a two-day delay buffer',
        'One compliant liquids bag per person; no full-size toiletries',
        'Phone, charging cable, and any power bank kept out of a gate-checked roller',
        'Download GPX tracks, offline maps, bookings, and train tickets before leaving Vienna',
      ],
    },
    {
      title: 'For Him',
      items: [
        '1 collared dinner shirt for Vienna / Grinzing',
        '1 lightweight belt only if the city trousers need it',
        'Use the hiking shoe for transit and trail days; add a compact city shoe only if it earns the weight',
      ],
    },
    {
      title: 'For Her',
      items: [
        '1 versatile dinner outfit that still layers cleanly',
        '2 sports bras and 1 regular bra, or the proven minimum that works across back-to-back hike days',
        '1 compact scarf or light layer for churches and cool evenings',
        'Wear the most supportive hiking or walking shoe on the plane',
      ],
    },
    {
      title: 'Laundry Reset',
      subtitle: 'Sept 9 in Ehrwald',
      tone: 'info',
      items: [
        'Pack a few laundry sheets or concentrated hand-wash soap',
        'Wash underwear, hiking socks, and quick-dry tops after checking in on Sept 9',
        'Roll washed items firmly in a towel before hanging overnight',
        'Use Sept 11 in Innsbruck as a small second reset only if weather slows drying',
      ],
    },
    {
      title: 'Skip',
      subtitle: 'How to stay under 8 kg',
      tone: 'warning',
      items: [
        'No bulky coat; the packable insulation + fleece + shell system replaces it',
        'No cotton hoodie or heavy sweater "just in case"',
        'No extra shoe beyond hiking pair plus one compact city pair',
        'No full-size toiletries',
        'No duplicate chargers, oversized camera kit, or backup outfits',
        'No untested footwear or brand-new blister-prone socks',
        'Do not risk sharp-tipped trekking poles in carry-on; rent locally unless current security and operating-carrier rules clearly cover the exact pair',
      ],
    },
  ],
}
