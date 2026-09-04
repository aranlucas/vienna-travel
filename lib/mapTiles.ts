// CARTO Voyager — muted, high-legibility basemap.
// Requires API key (free): https://carto.com/basemaps/apikey
// Key is passed as ?key= via NEXT_PUBLIC_CARTO_BASEMAP_KEY.
// Consumed by both HeroMap and PhaseMap.
const CARTO_VOYAGER_TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'

const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_BASEMAP_KEY?.trim()

export const MAP_TILE_URL = CARTO_KEY
  ? `${CARTO_VOYAGER_TILE_URL}?key=${CARTO_KEY}`
  : CARTO_VOYAGER_TILE_URL
export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
