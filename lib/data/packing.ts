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
    'Sample carry-on plan for warm city days, wet lake weather, strenuous alpine hikes, and exposed rail-and-cable-car summits. Adjust every quantity for the actual travelers, forecast, and baggage rules.',
  baggageRule:
    'The sizes and weights in this demo are placeholders. Check the operating carrier and fare shown on each real segment before packing.',
  strategy:
    'Wear the hiking shoes and heaviest midlayer in transit. Keep passports, medicines, batteries, and valuables in the personal item in case a larger bag is gate-checked.',
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
      subtitle: 'Adapt to the size of the travel party',
      items: [
        'Blister kit, compact first aid, pain meds, bandages, and leukotape',
        'One emergency space blanket per traveler',
        'A reliable power bank and short charging cable',
        'Enough EU plug adapters for the devices being carried',
        'Trail food and electrolyte packets; restock snacks in Vienna',
        'An appropriate cash backup in smaller notes for huts and tolls',
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
      title: 'Optional Smart-Casual Items',
      items: [
        'One dinner-ready top for Vienna or Grinzing',
        'A lightweight belt only if the city trousers need it',
        'Use the hiking shoe for transit and trail days; add a compact city shoe only if it earns the weight',
      ],
    },
    {
      title: 'Optional Comfort Items',
      items: [
        'One versatile dinner outfit that still layers cleanly',
        'Any personal support garments needed for back-to-back hike days',
        'A compact scarf or light layer for churches and cool evenings',
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
