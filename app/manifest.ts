import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Austria Expedition 2026',
    short_name: 'Austria 2026',
    description: 'Sept 5–14 | Vienna · Salzkammergut · Tyrol · Innsbruck — flights, stays, timeline, packing',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1a0f',
    theme_color: '#0f1a0f',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
